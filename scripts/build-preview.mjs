#!/usr/bin/env node
/**
 * Build preview/preview.html from the plugin's real sources (skins.ts +
 * ornament.module.css) so screenshots always match the shipped ornament.
 * Usage: node scripts/build-preview.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SKINS } from '../src/client/skins.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const css = await readFile(join(ROOT, 'src/client/ornament.module.css'), 'utf8')
await mkdir(join(ROOT, 'preview'), { recursive: true })

const rows = SKINS.map((skin) => {
  const ornament = [
    '<span class="ornament live" aria-hidden="true"',
    ` style="--dds-size:24px;color:${skin.accent}"`,
    '>',
    '<span class="figure">',
    skin.svg,
    '</span>',
    '<i class="bubble b1"></i><i class="bubble b2"></i><i class="bubble b3"></i>',
    '</span>',
  ].join('')
  const pillDark = `<div class="pill" data-preview-row="${skin.id}-dark"><span class="dot" style="background:${skin.accent}"></span>${ornament}<span class="text">Deep diving...</span></div>`
  const pillLight = `<div class="pill light" data-preview-row="${skin.id}-light"><span class="dot" style="background:${skin.accent}"></span>${ornament}<span class="text">Deep diving...</span></div>`
  const badgeDark = `<div class="icon-card dark" data-preview-icon="${skin.id}-dark"><span class="icon-avatar" style="color:${skin.accent}">${skin.svg}</span></div>`
  const badgeLight = `<div class="icon-card light" data-preview-icon="${skin.id}-light"><span class="icon-avatar" style="color:${skin.accent}">${skin.svg}</span></div>`
  return `<tr>
    <td class="name"><div class="name-box"><span class="name-title">${skin.nameZh}</span><span class="name-sub">${skin.nameEn}</span></div></td>
    <td class="cell icon-cell dark">${badgeDark}</td>
    <td class="cell dark">${pillDark}</td>
    <td class="cell icon-cell light">${badgeLight}</td>
    <td class="cell light">${pillLight}</td>
  </tr>`
}).join('\n')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>dsh-deep-dive-skins preview</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif; background: #0e1117; color: #f0f3f6; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 48px 36px; }
  .hero-header { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 24px; }
  h1 { font-size: 24px; font-weight: 600; margin: 0; letter-spacing: -0.02em; }
  p.sub { color: #8b949e; margin: 0; font-size: 14px; }
  table { border-collapse: separate; border-spacing: 0 14px; width: 100%; }
  th { text-align: left; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; padding: 0 16px 8px; color: #8b949e; }
  td { vertical-align: middle; }
  td.name { width: 160px; padding-right: 16px; }
  .name-box { display: flex; flex-direction: column; gap: 3px; }
  .name-title { font-size: 15px; font-weight: 600; color: #e6edf3; }
  .name-sub { font-size: 12px; color: #7d8590; }
  td.cell { padding: 14px 18px; }
  td.cell.dark { background: #161b22; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); }
  td.cell.light { background: #ffffff; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08); }
  td.cell:first-of-type { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
  td.cell:last-of-type { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
  .icon-cell { width: 68px; padding: 10px 14px !important; }
  .icon-card { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 10px; }
  .icon-card.dark { background: rgba(255,255,255,0.05); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1); }
  .icon-card.light { background: #f6f8fa; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06); }
  .icon-avatar { display: inline-flex; width: 36px; height: 36px; }
  .icon-avatar svg { width: 100%; height: 100%; }
  .pill { display: inline-flex; align-items: center; gap: 10px; border-radius: 999px; padding: 8px 18px 8px 14px; font-size: 14px; font-weight: 500; }
  .cell.dark .pill { background: rgba(255,255,255,0.06); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); color: #f0f6fc; }
  .cell.light .pill { background: #f6f8fa; box-shadow: inset 0 0 0 1px rgba(31,35,40,0.12); color: #1f2328; }
  .dot { width: 7px; height: 7px; border-radius: 50%; flex: none; }
  .text { white-space: nowrap; }
  .ornament { --dds-size: 24px; }
</style>
<link rel="stylesheet" href="../src/client/ornament.module.css"/>
</head>
<body>
<div class="wrap">
  <div class="hero-header">
    <h1>dsh-deep-dive-skins</h1>
    <p class="sub">Pre-deep-dive anime icons and status row preview</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>SKIN</th>
        <th colspan="2" style="padding-left:18px">DARK THEME</th>
        <th colspan="2" style="padding-left:18px">LIGHT THEME</th>
      </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>
</div>
</body>
</html>
`
await writeFile(join(ROOT, 'preview/preview.html'), html)
console.log('wrote preview/preview.html')
