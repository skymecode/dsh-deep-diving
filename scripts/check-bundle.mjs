/** Exercise the shipped factory and real React card with both scope binders. */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'

const dom = new JSDOM('<!doctype html><html lang="zh"><head></head><body></body></html>', { pretendToBeVisual: true })
for (const key of ['window', 'document', 'MutationObserver', 'HTMLElement', 'Node']) globalThis[key] = dom.window[key]
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const { createRoot } = await import('react-dom/client')
const { act } = React
const requires = new Set()
let plugin
window.__ModuleLoader__ = { load({ id, factory }) {
  assert.equal(id, 'dsh-deep-dive-skins')
  plugin = factory(id => {
    requires.add(id)
    if (id === 'react') return React
    if (id === 'react/jsx-runtime') return jsxRuntime
    throw new Error('Unexpected browser dependency: ' + id)
  })
} }
vm.runInThisContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'))
assert.deepEqual([...requires].sort(), ['react', 'react/jsx-runtime'])
assert.deepEqual(plugin.inject, ['slots', 'locale', 'settingsScope'])

for (const legacy of [false, true]) {
  document.body.innerHTML = '<div data-chat-flow><div role="status" aria-live="polite">Deep diving...<span>12s</span></div><div role="status" aria-live="polite">深度求索中...</div></div><ul id="card"></ul>'
  const base = { enabled: true, skin: 'whale-maid', size: 48, label: false, rotate: true, interval: 10, action: 'think' }
  let snapshot = { status: 'ready', writable: true, base, user: {}, value: base }
  const listeners = new Set()
  const publish = user => {
    snapshot = { ...snapshot, user, value: { ...base, ...user } }
    listeners.forEach(fn => fn())
  }
  const scope = {
    getSnapshot: () => snapshot,
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) },
    set: async (field, value) => publish({ ...snapshot.user, [field]: value }),
    unset: async field => { const user = { ...snapshot.user }; delete user[field]; publish(user) },
    mutate: () => { throw new Error('Cross-version settings must not use incompatible mutate') },
  }
  const effects = []
  let Card, face, dictionary
  const bind = spec => { assert.equal(spec.namespace, 'deep-dive-skins'); return scope }
  plugin.apply({
    effect(fn) { const off = fn(); if (typeof off === 'function') effects.push(off) },
    get: name => legacy && name === 'webUiSettings' ? { bind } : undefined,
    locale: { register(ns, values) { dictionary = values.zh } },
    settingsScope: { bind: spec => { assert.equal(legacy, false); return bind(spec) } },
    slots: {
      inject(name, fn) { assert.equal(name, 'settings.plugin.item'); fn() },
      register(options, component) {
        assert.equal(options.key, 'deep-dive-skins')
        assert.equal(options.id, undefined)
        Card = component; face = options.inject()
      },
    },
  })
  const ornament = () => document.querySelector('[data-dsh-deep-dive-skin]')
  assert.equal(document.querySelectorAll('[data-dsh-deep-dive-skin]').length, 2)
  assert.equal(ornament().dataset.ddsAction, 'think')
  const root = createRoot(document.getElementById('card'))
  await act(async () => root.render(React.createElement(Card, {
    ...face, t: key => dictionary[key],
    useDeepDiveSkinsCard: selector => selector(React.useSyncExternalStore(face.hooks.deepDiveSkinsCard.subscribe, face.hooks.deepDiveSkinsCard.getSnapshot)),
  })))
  const select = async (field, value) => {
    const id = 'settings-deep-dive-skins-' + field
    await act(async () => document.getElementById(id).click())
    const index = field === 'action'
      ? ['', 'think', 'run', 'snow', 'wave', 'code', 'bubbles', 'dance', 'idle'].indexOf(value)
      : ['', 'true', 'false'].indexOf(value)
    await act(async () => document.getElementById(`${id}-o${index}`).click())
  }
  const save = async () => act(async () => {
    const button = [...document.querySelectorAll('button')].find(el => el.textContent === '保存')
    assert.equal(button.disabled, false)
    button.click()
  })
  await select('action', 'snow')
  await select('rotate', 'false')
  assert.equal(ornament().dataset.ddsAction, 'think', 'draft must not apply before Save')
  await save()
  assert.equal(snapshot.user.action, 'snow')
  assert.equal(snapshot.user.rotate, false)
  assert.equal(ornament().dataset.ddsAction, 'snow')
  assert.ok(ornament().querySelector('span').style.backgroundImage.includes('data:image/webp;base64,'))
  await select('enabled', 'false')
  await save()
  assert.equal(ornament(), null)
  await select('enabled', 'true')
  await save()
  assert.ok(ornament())
  await act(async () => root.unmount())
  effects.reverse().forEach(off => off())
  assert.equal(ornament(), null)
  assert.equal(listeners.size, 0, 'plugin unload must unsubscribe both mount and form')
  assert.equal(document.querySelector('[role="status"]').textContent, 'Deep diving...12s')
  console.log('PASS release factory + real settings card:', legacy ? 'legacy webUiSettings binder' : 'modern settingsScope binder')
}
dom.window.close()

// Real current SDK provider, not a registration stub.
const { Context } = await import('@deepseek-ai/cordis')
const settingsModule = process.argv[2] ?? '@deepseek-ai/dsh-settings'
const { SettingsProvider } = await import(settingsModule)
const host = await import('../lib/index.js')
class MemorySettings extends SettingsProvider {
  get writable() { return true }
  async load() { return {} }
  async persist() {}
}
const ctx = new Context()
const provider = ctx.plugin(MemorySettings)
await provider
const installed = ctx.plugin(host)
await installed
assert.equal(ctx.settings.get('deep-dive-skins').skin, 'whale-maid')
assert.equal(ctx.settings.get('deep-dive-skins').interval, 10)
await installed.dispose()
assert.equal(ctx.settings.get('deep-dive-skins'), undefined)
await provider.dispose()
console.log('PASS host registration/unload with real SettingsProvider:', settingsModule)
