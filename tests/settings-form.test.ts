import { describe, expect, it, vi } from 'vitest'
import { CardForm, booleanField, numberField } from '../src/client/settings-form.ts'
import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client'

function setup() {
  const snapshot = {
    status: 'ready' as const, value: { rotate: true, interval: 10 },
    base: { rotate: true, interval: 10 }, user: {} as Record<string, unknown>,
    writable: true, mode: 'host' as const, revision: 1,
  }
  const off = vi.fn()
  const scope = {
    getSnapshot: () => snapshot, subscribe: () => off,
    set: vi.fn(async (field: string, value: unknown) => { snapshot.user[field] = value }),
    unset: vi.fn(async (field: string) => { delete snapshot.user[field] }),
    // Modern path operations and the old bridge's field operations differ.
    mutate: vi.fn(async () => { throw new Error('incompatible batch API') }),
  }
  const form = new CardForm(scope as unknown as SettingsScope<unknown>, [booleanField('rotate'), numberField('interval', { min: 10, max: 60 })])
  return { form, scope, snapshot, off }
}

describe('cross-version settings writes', () => {
  it('saves independent fields using the shared set/unset API and accepted read-back', async () => {
    const { form, scope, snapshot, off } = setup()
    form.actions().edit('rotate', 'false')
    form.actions().edit('interval', '20')
    await form.save()
    expect(snapshot.user).toEqual({ rotate: false, interval: 20 })
    expect(form.shell()).toMatchObject({ dirty: false, failed: false, saving: false })
    expect(scope.mutate).not.toHaveBeenCalled()
    form.actions().resetField('rotate')
    await form.save()
    expect(snapshot.user).not.toHaveProperty('rotate')
    form.dispose()
    expect(off).toHaveBeenCalledOnce()
  })

  it('keeps drafts and releases the saving state when a provider rejects a write', async () => {
    const { form, scope } = setup()
    scope.set.mockRejectedValueOnce(new Error('Disconnected'))
    form.actions().edit('interval', '20')
    await form.save()
    expect(form.shell()).toMatchObject({ dirty: true, failed: true, saving: false, failedReason: 'Disconnected' })
    await form.save()
    expect(form.shell()).toMatchObject({ dirty: false, failed: false })
    form.dispose()
  })
})
