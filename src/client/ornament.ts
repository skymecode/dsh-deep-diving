/**
 * Pre-deep-dive ornament mount for the native DSH turn-status row.
 *
 * The official conversation client owns the status text and lifecycle. This
 * helper claims the same slot dsh-pet's working-whale uses — it removes any
 * existing spouting-whale ornament and inserts its own skin ornament ahead
 * of the "Deep diving..." text, then self-heals when React replaces the
 * ornament during a render. Our ornament carries the
 * data-dsh-pet-working-whale marker on purpose: dsh-pet's own decorator
 * checks that marker and skips, so the two plugins never stack.
 * @module dsh-deep-dive-skins/ornament
 */

import css from './ornament.module.css'
import { SKINS, DEFAULT_SKIN_ID, resolveSkin, randomSkin, type DiveSkin } from './skins.ts'

/** Settings snapshot the ornament reads on every mutation. */
export interface DiveSkinConfig {
  /** Master switch; when off the ornament never touches the status row. */
  enabled: boolean
  /** Stored skin id, or 'random' to pick per status-row appearance. */
  skin: string
  /** Ornament height in px. */
  size: number
  /** Replace the 'Deep diving...' text with the skin's label. */
  label: boolean
}

const TURN_STATUS_SELECTOR = '[data-chat-flow] [role="status"][aria-live="polite"]'
const TURN_STATUS_TEXT = 'Deep diving...'
const ORNAMENT_SELECTOR = '[data-dsh-deep-dive-skin]'
const CLAIM_SELECTOR = '[data-dsh-pet-working-whale]'

/** Every label this plugin may have written; used to re-assert on re-renders. */
const LABEL_SET = new Set<string>()
for (const skin of SKINS) {
  LABEL_SET.add(skin.labelZh)
  LABEL_SET.add(skin.labelEn)
}

/** The turn status keeps its label in a direct text node beside the clock. */
function carriesTurnStatusText(element: Element): boolean {
  return [...element.childNodes].some(node =>
    node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === TURN_STATUS_TEXT,
  )
}

/** Direct text nodes this plugin may have relabeled (original or a skin label). */
function carriesKnownStatusText(element: Element): boolean {
  return [...element.childNodes].some(node => {
    if (node.nodeType !== Node.TEXT_NODE) return false
    const text = node.textContent?.trim() ?? ''
    return text === TURN_STATUS_TEXT || LABEL_SET.has(text)
  })
}

/** Build one ornament span: figure + bubbles, sized and tinted by config. */
function createOrnament(document: Document, skin: DiveSkin, size: number): HTMLSpanElement {
  const ornament = document.createElement('span')
  ornament.className = css.ornament + ' ' + css.live
  ornament.dataset.dshDeepDiveSkin = ''
  ornament.dataset.ddsSkin = skin.id
  ornament.setAttribute('aria-hidden', 'true')
  // Claim the slot dsh-pet's working-whale decorator guards.
  ornament.dataset.dshPetWorkingWhale = ''
  ornament.style.setProperty('--dds-size', size + 'px')
  ornament.style.color = skin.accent

  const figure = document.createElement('span')
  figure.className = css.figure
  // Trusted static markup from this bundle (never user input).
  figure.innerHTML = skin.svg
  ornament.appendChild(figure)

  for (const bubbleClass of [css.b1, css.b2, css.b3]) {
    const bubble = document.createElement('i')
    bubble.className = css.bubble + ' ' + bubbleClass
    ornament.appendChild(bubble)
  }
  return ornament
}

/** Apply the skin label to the status text node when enabled. */
function applyLabel(element: HTMLElement, skin: DiveSkin, enabled: boolean): void {
  const target = enabled ? (document.documentElement.lang.startsWith('zh') ? skin.labelZh : skin.labelEn) : TURN_STATUS_TEXT
  for (const node of element.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE) continue
    const text = node.textContent?.trim() ?? ''
    if (text === TURN_STATUS_TEXT || LABEL_SET.has(text)) {
      node.textContent = target
      return
    }
  }
}

/** Decorate one status node: remove rivals, insert (or keep) our ornament. */
function decorate(element: Element, config: DiveSkinConfig, pick: () => DiveSkin): void {
  if (!(element instanceof HTMLElement)) return
  if (!element.matches(TURN_STATUS_SELECTOR)) return
  if (!config.enabled) return
  if (!carriesTurnStatusText(element) && !carriesKnownStatusText(element)) return
  if (element.querySelector(ORNAMENT_SELECTOR) !== null) {
    applyLabel(element, resolveSkin(config.skin), config.label)
    return
  }
  // Remove any spouting whale dsh-pet (or a previous run) inserted.
  for (const claim of element.querySelectorAll(CLAIM_SELECTOR)) claim.remove()
  const skin = config.skin === 'random' ? pick() : resolveSkin(config.skin)
  const ornament = createOrnament(element.ownerDocument, skin, config.size)
  applyLabel(element, skin, config.label)
  element.insertBefore(ornament, element.firstChild)
}

/**
 * Mount the pre-dive ornament and return its complete disposer.
 * @param root - page subtree to observe; defaults to the application body.
 * @param read - live settings snapshot (re-read on every mutation).
 */
export function mountDiveSkins(root: HTMLElement, read: () => DiveSkinConfig): () => void {
  const pick = (): DiveSkin => randomSkin()
  const scan = (): void => {
    for (const status of root.querySelectorAll(TURN_STATUS_SELECTOR)) {
      decorate(status, read(), pick)
    }
  }
  scan()

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.target instanceof Element) decorate(record.target, read(), pick)
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue
        if (node.matches(TURN_STATUS_SELECTOR)) decorate(node, read(), pick)
        for (const status of node.querySelectorAll(TURN_STATUS_SELECTOR)) {
          decorate(status, read(), pick)
        }
      }
    }
  })
  observer.observe(root, { childList: true, subtree: true })

  return () => {
    observer.disconnect()
    for (const ornament of root.querySelectorAll(ORNAMENT_SELECTOR)) ornament.remove()
  }
}
