/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountDiveSkins, type DiveSkinConfig } from '../src/client/ornament.ts'
import { SKINS } from '../src/client/skins.ts'
import { MAID_ACTION_IDS } from '../src/client/whale-maid.ts'

const SKIN_IDS = new Set(SKINS.map(skin => skin.id))

function config(overrides: Partial<DiveSkinConfig> = {}): DiveSkinConfig {
  return { enabled: true, skin: 'whale', size: 20, label: false, ...overrides }
}

function makeStatusRow(): { root: HTMLElement; status: HTMLElement } {
  const root = document.createElement('div')
  root.dataset.chatFlow = ''
  const status = document.createElement('div')
  status.setAttribute('role', 'status')
  status.setAttribute('aria-live', 'polite')
  status.appendChild(document.createTextNode('Deep diving...'))
  root.appendChild(status)
  document.body.appendChild(root)
  return { root, status }
}

function statusText(status: HTMLElement): string {
  return [...status.childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent ?? '')
    .join('')
}

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.lang = 'en'
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('mountDiveSkins', () => {
  it('retains the rc.2 turn clock without restarting rotation on each elapsed tick', async () => {
    // DSH 0.1.5-rc.2 ChatView/TurnStatus: direct label, then an aria-hidden
    // clock after 15 seconds. The host updates that child every second.
    vi.useFakeTimers()
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config({ skin: 'whale-maid' }))
    vi.advanceTimersByTime(15_000)
    const running = status.querySelector<HTMLElement>('[data-dds-action]')!
    expect(running.dataset.ddsAction).toBe('run')
    const clock = document.createElement('span')
    clock.setAttribute('aria-hidden', 'true')
    status.append(clock)
    for (let elapsed = 15; elapsed < 20; elapsed++) {
      clock.textContent = `${elapsed}s`
      await Promise.resolve()
      expect(status.querySelector('[data-dds-action]')).toBe(running)
      vi.advanceTimersByTime(1000)
    }
    expect(status.querySelector<HTMLElement>('[data-dds-action]')!.dataset.ddsAction).toBe('snow')
    expect(status.contains(clock)).toBe(true)
    dispose()
    expect(statusText(status)).toBe('Deep diving...')
    expect(clock.textContent).toBe('19s')
  })

  it('ignores nested message status and releases the timer when switching conversations', async () => {
    vi.useFakeTimers()
    const { root, status } = makeStatusRow()
    root.insertAdjacentHTML('afterbegin', '<div data-chat-flow-key="tool-1"><div role="status">Retrying</div></div><p>Deep diving...</p>')
    const dispose = mountDiveSkins(document.body, () => config({ skin: 'whale-maid' }))
    expect(document.querySelectorAll('[data-dds-skin]')).toHaveLength(1)
    expect(status.querySelector('[data-dds-skin]')).not.toBeNull()
    root.remove()
    await Promise.resolve()
    expect(vi.getTimerCount()).toBe(0)
    const next = makeStatusRow()
    await Promise.resolve()
    expect(next.status.querySelector<HTMLElement>('[data-dds-action]')!.dataset.ddsAction).toBe('think')
    expect(vi.getTimerCount()).toBe(1)
    dispose()
  })

  it('cycles all eight maid actions in the same turn, then loops', () => {
    vi.useFakeTimers()
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config({ skin: 'whale-maid' }))
    for (const action of [...MAID_ACTION_IDS, MAID_ACTION_IDS[0]]) {
      expect(status.querySelector('[data-dds-action]')?.getAttribute('data-dds-action')).toBe(action)
      expect(status.querySelector('[data-dsh-deep-dive-skin]')?.querySelector('span')?.style.backgroundImage.startsWith('url(data:image/webp;base64,')).toBe(true)
      vi.advanceTimersByTime(10_000)
    }
    dispose()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('supports the current Chinese status and restores text/rival on disable', () => {
    const { root, status } = makeStatusRow()
    status.firstChild!.textContent = '深度求索中...'
    const rival = document.createElement('i')
    rival.dataset.dshPetWorkingWhale = ''
    status.prepend(rival)
    const settings = config({ skin: 'whale-maid', label: true })
    const dispose = mountDiveSkins(root, () => settings)
    expect(status.querySelector('[data-dds-skin="whale-maid"]')).not.toBeNull()
    settings.enabled = false
    dispose.refresh()
    expect(statusText(status)).toBe('深度求索中...')
    expect(status.contains(rival)).toBe(true)
    dispose()
  })

  it('updates settings immediately and can fix a single animation', () => {
    vi.useFakeTimers()
    const { root, status } = makeStatusRow()
    const settings = config({ skin: 'whale-maid' })
    const dispose = mountDiveSkins(root, () => settings)
    Object.assign(settings, { action: 'snow', size: 96, rotate: false })
    dispose.refresh()
    vi.advanceTimersByTime(60_000)
    const ornament = status.querySelector<HTMLElement>('[data-dds-action]')!
    expect(ornament.dataset.ddsAction).toBe('snow')
    expect(ornament.style.getPropertyValue('--dds-size')).toBe('96px')
    expect(vi.getTimerCount()).toBe(0)
    settings.size = 999
    dispose.refresh()
    expect(ornament.style.getPropertyValue('--dds-size')).toBe('96px')
    dispose()
  })

  it('does not repeat the random skin consecutively or change it on incidental mutations', async () => {
    vi.useFakeTimers()
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config({ skin: 'random', label: true }))
    let previous = status.querySelector<HTMLElement>('[data-dds-skin]')!
    for (let i = 0; i < 12; i++) {
      status.append(document.createElement('b'))
      await Promise.resolve()
      expect(status.querySelector('[data-dds-skin]')).toBe(previous)
      vi.advanceTimersByTime(10_000)
      const current = status.querySelector<HTMLElement>('[data-dds-skin]')!
      expect(current.dataset.ddsSkin).not.toBe(previous.dataset.ddsSkin)
      expect(statusText(status)).toBe(SKINS.find(skin => skin.id === current.dataset.ddsSkin)!.labelEn)
      previous = current
    }
    dispose()
  })

  it('stops timers when the turn ends and resumes for a new row', async () => {
    vi.useFakeTimers()
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config({ skin: 'whale-maid' }))
    expect(vi.getTimerCount()).toBe(1)
    status.replaceChildren(document.createTextNode('Done'))
    await Promise.resolve()
    expect(vi.getTimerCount()).toBe(0)
    expect(status.querySelector('[data-dds-skin]')).toBeNull()
    status.replaceChildren(document.createTextNode('Deep diving...'))
    await Promise.resolve()
    expect(vi.getTimerCount()).toBe(1)
    dispose()
  })

  it('pauses in background tabs and for reduced motion and removes listeners', () => {
    vi.useFakeTimers()
    const media = new EventTarget() as EventTarget & { matches: boolean }
    media.matches = true
    const remove = vi.spyOn(media, 'removeEventListener')
    vi.stubGlobal('matchMedia', () => media)
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config({ skin: 'whale-maid' }))
    expect(vi.getTimerCount()).toBe(0)
    expect(status.querySelector('[data-dds-paused]')).not.toBeNull()
    media.matches = false
    media.dispatchEvent(new Event('change'))
    expect(vi.getTimerCount()).toBe(1)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    expect(vi.getTimerCount()).toBe(0)
    dispose()
    expect(remove).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('inserts an ornament that claims the dsh-pet slot', () => {
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config())
    const ornament = status.querySelector('[data-dsh-deep-dive-skin]')
    expect(ornament).not.toBeNull()
    expect(ornament!.hasAttribute('data-dsh-pet-working-whale')).toBe(true)
    expect(ornament!.getAttribute('data-dds-skin')).toBe('whale')
    expect(ornament!.getAttribute('aria-hidden')).toBe('true')
    dispose()
  })

  it('removes a pre-existing spouting-whale ornament', () => {
    const { root, status } = makeStatusRow()
    const whale = document.createElement('span')
    whale.dataset.dshPetWorkingWhale = ''
    whale.className = 'rival'
    status.insertBefore(whale, status.firstChild)
    const dispose = mountDiveSkins(root, () => config())
    expect(status.querySelector('.rival')).toBeNull()
    expect(status.querySelector('[data-dsh-deep-dive-skin]')).not.toBeNull()
    dispose()
  })

  it('replaces the status text when the label setting is on', () => {
    const { root, status } = makeStatusRow()
    document.documentElement.lang = 'zh'
    const dispose = mountDiveSkins(root, () => config({ skin: 'catgirl', label: true }))
    expect(statusText(status)).toBe('喵式下潜…')
    dispose()
  })

  it('keeps the original text when the label setting is off', () => {
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config({ label: false }))
    expect(statusText(status)).toBe('Deep diving...')
    dispose()
  })

  it('leaves the row untouched while disabled', () => {
    const { root, status } = makeStatusRow()
    const whale = document.createElement('span')
    whale.dataset.dshPetWorkingWhale = ''
    status.insertBefore(whale, status.firstChild)
    const dispose = mountDiveSkins(root, () => config({ enabled: false }))
    expect(status.querySelector('[data-dsh-pet-working-whale]')).not.toBeNull()
    expect(status.querySelector('[data-dsh-deep-dive-skin]')).toBeNull()
    dispose()
  })

  it('random mode only ever picks registered skins', () => {
    for (let i = 0; i < 25; i += 1) {
      const { root, status } = makeStatusRow()
      const dispose = mountDiveSkins(root, () => config({ skin: 'random' }))
      const skinId = status.querySelector('[data-dsh-deep-dive-skin]')?.getAttribute('data-dds-skin')
      expect(skinId).not.toBeNull()
      expect(SKIN_IDS.has(skinId!)).toBe(true)
      dispose()
    }
  })

  it('self-heals when React replaces the ornament', async () => {
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config())
    expect(status.querySelector('[data-dsh-deep-dive-skin]')).not.toBeNull()
    // Simulate a React re-render: ornament removed, text node replaced.
    status.querySelector('[data-dsh-deep-dive-skin]')!.remove()
    status.replaceChildren(document.createTextNode('Deep diving...'))
    status.appendChild(document.createTextNode('Deep diving...'))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(status.querySelector('[data-dsh-deep-dive-skin]')).not.toBeNull()
    dispose()
  })

  it('dispose removes every ornament it added', () => {
    const { root, status } = makeStatusRow()
    const dispose = mountDiveSkins(root, () => config())
    expect(status.querySelector('[data-dsh-deep-dive-skin]')).not.toBeNull()
    dispose()
    expect(status.querySelector('[data-dsh-deep-dive-skin]')).toBeNull()
  })
})
