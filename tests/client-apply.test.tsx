// @vitest-environment jsdom
/**
 * Regression guard for supported DSH rc.7+: `settings.plugin.item` is keyed by the
 * settings namespace, so registering with a list-slot `id` aborts Web GUI
 * plugin loading.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/client/ornament.ts', () => ({
  mountDiveSkins: () => () => {},
}))

vi.mock('../src/client/SettingsCard.tsx', () => ({
  DeepDiveSkinsCard: () => null,
  DeepDiveSkinsCardController: class {
    constructor(_scope: unknown) {}
    inject() { return {} }
  },
}))

import { apply, NS } from '../src/client/index.ts'

describe('deep-dive-skins client registration', () => {
  beforeEach(() => {
    document.body.replaceChildren()
  })

  function applyWithBinders(useLegacy = false) {
    const injected: string[] = []
    const registered: Array<Record<string, unknown>> = []
    const scope = {
      getSnapshot: () => ({ status: 'ready', value: { enabled: false } }),
      subscribe: () => () => {},
    }
    const officialBind = vi.fn(() => scope)
    const legacy = useLegacy ? { bind: vi.fn(() => scope) } : undefined
    const fakeCtx = {
      effect: (fn: () => unknown) => {
        fn()
        return () => {}
      },
      locale: {
        register: () => {},
      },
      get: (name: string) => name === 'webUiSettings' ? legacy : undefined,
      settingsScope: {
        bind: officialBind,
      },
      slots: {
        inject: (name: string, fn: () => unknown) => {
          injected.push(name)
          fn()
          return () => {}
        },
        register: (options: Record<string, unknown>) => {
          registered.push(options)
          return () => {}
        },
      },
    }

    apply(fakeCtx as never)

    return { injected, legacy, officialBind, registered }
  }

  it('registers its settings card under the namespace key on current DSH', () => {
    const { injected, officialBind, registered } = applyWithBinders()

    expect(injected).toContain('settings.plugin.item')
    expect(officialBind).toHaveBeenCalledWith({ namespace: NS })
    expect(registered).toHaveLength(1)
    expect(registered[0]).toMatchObject({
      name: 'settings.plugin.item',
      key: NS,
    })
    expect(registered[0]).not.toHaveProperty('id')
    expect(registered[0]).not.toHaveProperty('order')
  })

  it('uses the legacy dsh-web-ui settings binder when it is available', () => {
    const result = applyWithBinders(true)

    expect(result.legacy?.bind).toHaveBeenCalledWith({ namespace: NS })
    expect(result.officialBind).not.toHaveBeenCalled()
  })
})
