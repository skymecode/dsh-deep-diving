/** @vitest-environment jsdom */

import { afterEach, describe, expect, it } from 'vitest'
import { mountDiveSkins, type DiveSkinConfig } from '../src/client/ornament.ts'
import { SKINS } from '../src/client/skins.ts'

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
})

describe('mountDiveSkins', () => {
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
