import css from './ornament.module.css'
import { SKINS, resolveSkin, randomSkin, type DiveSkin } from './skins.ts'
import { MAID_ACTIONS, MAID_ACTION_IDS, resolveAction, type MaidAction } from './whale-maid.ts'

export interface DiveSkinConfig {
  enabled: boolean
  skin: string
  size: number
  label: boolean
  rotate?: boolean
  interval?: number
  action?: string
}

const STATUS = '[data-chat-flow] [role="status"][aria-live="polite"]'
const ORNAMENT = '[data-dsh-deep-dive-skin]'
// ui-chat owns this row since 0.1.2; older ui-conversation used the same DOM.
const NATIVE_LABELS = new Set(['Deep diving...', 'Deep diving…', '深度求索中...', '深度求索中…'])
const OUR_LABELS = new Set(SKINS.flatMap(skin => [skin.labelEn, skin.labelZh]))

interface RowState {
  skin: DiveSkin
  action: MaidAction
  ornament: HTMLElement | undefined
  original: string
  labelNode: Text
  displaced: Element[]
  choice: string
  selectedAction: string
  nextAt: number
  interval: number
}

function labelNode(row: Element): Text | undefined {
  return [...row.childNodes].find((node): node is Text =>
    node.nodeType === 3 && (NATIVE_LABELS.has(node.textContent?.trim() ?? '') || OUR_LABELS.has(node.textContent?.trim() ?? '')),
  )
}

function bounded(value: number | undefined, fallback: number, min: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value!)) : fallback
}

function nextSkin(previous: DiveSkin): DiveSkin {
  const choices = SKINS.filter(skin => skin.id !== previous.id)
  return choices[Math.floor(Math.random() * choices.length)]!
}

function createOrnament(doc: Document, state: RowState, size: number, paused: boolean): HTMLElement {
  const span = doc.createElement('span')
  span.className = css.ornament + ' ' + css.live
  span.dataset.dshDeepDiveSkin = ''
  span.dataset.dshPetWorkingWhale = ''
  span.dataset.ddsSkin = state.skin.id
  span.dataset.ddsAction = state.action
  span.setAttribute('aria-hidden', 'true')
  span.style.setProperty('--dds-size', size + 'px')
  span.style.color = state.skin.accent
  const figure = doc.createElement('span')
  if (state.skin.id === 'whale-maid') {
    span.classList.add(css.maid)
    figure.className = css.sprite
    figure.style.backgroundImage = 'url("' + MAID_ACTIONS[state.action] + '")'
  } else {
    figure.className = css.figure
    figure.innerHTML = state.skin.svg // Only trusted, bundled SVG markup.
    for (const c of [css.b1, css.b2, css.b3]) {
      const bubble = doc.createElement('i')
      bubble.className = css.bubble + ' ' + c
      span.appendChild(bubble)
    }
  }
  if (paused) span.dataset.ddsPaused = ''
  span.appendChild(figure)
  return span
}

/** Callable disposer; refresh applies settings immediately without restarting a turn. */
export interface DiveSkinMount {
  (): void
  refresh(): void
}

export function mountDiveSkins(root: HTMLElement, read: () => DiveSkinConfig): DiveSkinMount {
  const doc = root.ownerDocument
  const media = doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')
  const rows = new Map<HTMLElement, RowState>()
  let timer: ReturnType<typeof setTimeout> | undefined
  let disposed = false

  const restore = (row: HTMLElement, state: RowState): void => {
    state.ornament?.remove()
    if (OUR_LABELS.has(state.labelNode.data.trim())) state.labelNode.data = state.original
    if (root.contains(row) && labelNode(row)) {
      for (const element of state.displaced) row.prepend(element)
    }
    rows.delete(row)
  }

  const scan = (): void => {
    if (disposed) return
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    // Ignore our own child/text writes; one external mutation triggers one scan.
    observer.disconnect()
    const config = read()
    const paused = media?.matches === true || doc.hidden
    const now = Date.now()
    const interval = bounded(config.interval, 10, 10, 60) * 1000
    for (const [row, state] of rows) {
      if (!root.contains(row) || !row.matches(STATUS) || !labelNode(row) || !config.enabled) restore(row, state)
    }
    if (config.enabled) for (const row of root.querySelectorAll<HTMLElement>(STATUS)) {
      const text = labelNode(row)
      if (!text) continue
      let state = rows.get(row)
      if (!state) {
        state = {
          skin: config.skin === 'random' ? randomSkin() : resolveSkin(config.skin),
          action: resolveAction(config.action), ornament: undefined,
          original: text.data, labelNode: text, displaced: [], choice: config.skin,
          selectedAction: config.action ?? 'think', nextAt: now + interval, interval,
        }
        rows.set(row, state)
      }
      // React may replace the text node or switch the UI language mid-turn.
      if (NATIVE_LABELS.has(text.data.trim())) state.original = text.data
      state.labelNode = text
      const action = config.action ?? 'think'
      if (state.choice !== config.skin || state.selectedAction !== action) {
        state.choice = config.skin
        state.selectedAction = action
        state.skin = config.skin === 'random' ? randomSkin() : resolveSkin(config.skin)
        state.action = resolveAction(action)
        state.nextAt = now + interval
      }
      if (state.interval !== interval || paused || config.rotate === false) state.nextAt = now + interval
      state.interval = interval
      if (!paused && config.rotate !== false && now >= state.nextAt) {
        if (config.skin === 'random') state.skin = nextSkin(state.skin)
        state.action = MAID_ACTION_IDS[(MAID_ACTION_IDS.indexOf(state.action) + 1) % MAID_ACTION_IDS.length]!
        state.nextAt = now + interval
      }
      // Reuse the chosen skin, including random mode, until a scheduled change.
      const previous = state.ornament
      if (!previous || previous.parentElement !== row || previous.dataset.ddsSkin !== state.skin.id || previous.dataset.ddsAction !== state.action) {
        previous?.remove()
        for (const claim of row.querySelectorAll('[data-dsh-pet-working-whale]')) {
          if (!claim.matches(ORNAMENT)) state.displaced.push(claim)
          claim.remove()
        }
        state.ornament = createOrnament(doc, state, bounded(config.size, 48, 14, 96), paused)
        row.prepend(state.ornament)
      }
      const ornament = state.ornament!
      ornament.style.setProperty('--dds-size', bounded(config.size, 48, 14, 96) + 'px')
      ornament.toggleAttribute('data-dds-paused', paused)
      const target = config.label
        ? (doc.documentElement.lang.startsWith('zh') ? state.skin.labelZh : state.skin.labelEn)
        : state.original
      if (text.data !== target) text.data = target
    }
    observer.observe(root, { childList: true, characterData: true, subtree: true })
    if (rows.size && !paused && config.enabled && config.rotate !== false) {
      const deadline = Math.min(...[...rows.values()].map(state => state.nextAt))
      timer = setTimeout(scan, Math.max(1, deadline - Date.now()))
    }
  }
  const observer = new MutationObserver(scan)
  doc.addEventListener('visibilitychange', scan)
  media?.addEventListener('change', scan)
  scan()
  const dispose = (() => {
    disposed = true
    observer.disconnect()
    if (timer !== undefined) clearTimeout(timer)
    doc.removeEventListener('visibilitychange', scan)
    media?.removeEventListener('change', scan)
    for (const [row, state] of rows) restore(row, state)
  }) as DiveSkinMount
  dispose.refresh = scan
  return dispose
}
