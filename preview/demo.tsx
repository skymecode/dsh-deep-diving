/** Local QA: real release factory + real settings card, simulated host scope. */
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client'
import { MAID_ACTIONS } from '../src/client/whale-maid'
import { zh } from '../src/client/locales'
import css from '../src/client/ornament.module.css'
import './demo.css'
import manifest from '../package.json'

const base = { enabled: true, skin: 'whale-maid', size: 48, label: false, rotate: true, interval: 10, action: 'think' }
let snapshot = { status: 'ready', writable: true, base, user: {}, value: base }
const listeners = new Set<() => void>()
const publish = (user: Record<string, unknown>) => {
  snapshot = { ...snapshot, user, value: { ...base, ...user } }
  listeners.forEach(listener => listener())
}
const scope = {
  getSnapshot: () => snapshot,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
  set: async (field: string, value: unknown) => publish({ ...snapshot.user, [field]: value }),
  unset: async (field: string) => { const user = { ...snapshot.user }; delete user[field]; publish(user) },
  mutate: () => { throw new Error('Use the cross-version set/unset contract') },
}
let plugin
let Card
let face
const effects: Array<() => void> = []
window.__ModuleLoader__ = {
  load(entry) {
    const modules = { react: React, 'react/jsx-runtime': jsxRuntime }
    plugin = entry.factory(id => {
      if (!(id in modules)) throw new Error('Unexpected external module: ' + id)
      return modules[id]
    })
  },
}
// Do not import source apply(): this verifies the exact factory we distribute.
await import('../lib/client.js')
plugin.apply({
  effect(fn) { const off = fn(); if (typeof off === 'function') effects.push(off) },
  locale: { register() {} }, get() {}, settingsScope: { bind: () => scope },
  slots: {
    inject(name, fn) { fn() },
    register(options, component) {
      if (options.name !== 'settings.plugin.item' || options.key !== 'deep-dive-skins') throw new Error('Invalid keyed slot')
      Card = component; face = options.inject()
    },
  },
})

function Settings() {
  return <Card {...face} t={key => zh[key] ?? key} useDeepDiveSkinsCard={selector => selector(React.useSyncExternalStore(face.hooks.deepDiveSkinsCard.subscribe, face.hooks.deepDiveSkinsCard.getSnapshot))} />
}
function App() {
  const [active, setActive] = React.useState(true)
  const [mounted, setMounted] = React.useState(true)
  return <main>
    <header><span className="eyebrow">DEEP DIVE SKINS · {manifest.version}</span><h1>蓝色大肥鱼，陪你一起求索。</h1><p>思考、奔跑、堆雪人……让漫长的 Deep diving 多一点灵动。</p></header>
    <section className="stage"><div className="section-heading"><h2>同一轮求索 · 持续变化</h2><span>每 10 秒一个新动作</span></div>
      <div className="themes">
        <div className="sample dark"><small>DARK / ENGLISH</small><div data-chat-flow><div role="status" aria-live="polite">{active ? 'Deep diving...' : 'Done'}<span className="elapsed"> · 12s</span></div></div></div>
        <div className="sample light"><small>LIGHT / 中文</small><div data-chat-flow><div role="status" aria-live="polite">{active ? '深度求索中...' : '已完成'}<span className="elapsed"> · 12 秒</span></div></div></div>
      </div>
      <div className="controls"><button onClick={() => setActive(!active)}>{active ? '结束求索' : '开始求索'}</button><button disabled={!mounted} onClick={() => { effects.splice(0).reverse().forEach(off => off()); setMounted(false) }}>卸载插件</button><span>{mounted ? '已加载发布 bundle · 无外部素材请求' : '已卸载 · 刷新页面重新加载'}</span></div>
    </section>
    <section><div className="section-heading"><h2>一只鲸鱼娘，八种小日常</h2><span>透明动画 / 深浅主题</span></div>
      <div className="actions">{Object.entries(MAID_ACTIONS).map(([id, url]) => <article key={id}>
        <div className="pair">{['dark', 'light'].map(theme => <div className={theme + ' tile'} key={theme}><span className={css.ornament + ' ' + css.maid} style={{ '--dds-size': '96px' } as React.CSSProperties}><span className={css.sprite} style={{ backgroundImage: `url("${url}")` }} /></span></div>)}</div>
        <strong>{zh[`action.${id}`]}</strong><small>{id.toUpperCase()}</small>
      </article>)}</div>
    </section>
    <section className="settings"><h2>真实设置卡片</h2><p>此预览只模拟 Host 存储；保存即时应用，刷新恢复默认。</p><ul><Settings /></ul></section>
    <footer>动画来源：<a href="https://github.com/PC2005-cloud/dsh-pet/tree/e1ff8c1e4001878cbb80441262d530e16541f138">PC2005-cloud/dsh-pet</a> · 上游素材允许开源使用、禁止商用。插件代码 Apache-2.0。</footer>
  </main>
}
createRoot(document.getElementById('app')!).render(<App />)
window.addEventListener('pagehide', () => effects.splice(0).reverse().forEach(off => off()), { once: true })
