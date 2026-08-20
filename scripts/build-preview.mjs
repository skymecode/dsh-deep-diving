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

const svgOf = (svg) => svg.replace(/</g, '&lt;').replace(/>/g, '&gt;')

const rows = SKINS.map((skin) => {
  const ornament = [
    '<span class="ornament live" aria-hidden="true"',
    ` style="--dds-size:20px;color:${skin.accent}"`,
    '>',
    '<span class="figure">',
    svgOf(skin.svg),
    '</span>',
    '<i class="bubble b1"></i><i class="bubble b2"></i><i class="bubble b3"></i>',
    '</span>',
  ].join('')
  const pillDark = `<div class="pill" data-preview-row="${skin.id}-dark"><span class="dot" style="background:${skin.accent}"></span>${ornament}<span class="text">Deep diving...</span></div>`
  const pillLight = `<div class="pill light" data-preview-row="${skin.id}-light"><span class="dot" style="background:${skin.accent}"></span>${ornament}<span class="text">Deep diving...</span></div>`
  return `<tr>
    <td class="name">${skin.nameZh}<br/><small>${skin.nameEn}</small></td>
    <td class="cell dark">${pillDark}</td>
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
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif; background: #10131a; color: #e8eaed; }
  .wrap { max-width: 1080px; margin: 0 auto; padding: 40px 32px; }
  h1 { font-size: 22px; margin: 0 0 6px; }
  p.sub { color: #9aa3b2; margin: 0 0 28px; font-size: 14px; }
  table { border-collapse: separate; border-spacing: 0 12px; width: 100%; }
  td { vertical-align: middle; }
  td.name { width: 180px; font-size: 15px; line-height: 1.5; padding-right: 20px; }
  td.name small { color: #9aa3b2; }
  td.cell { border-radius: 14px; padding: 18px 20px; }
  td.cell.dark { background: linear-gradient(180deg, #1b2029, #151a22); box-shadow: inset 0 0 0 1px #2a3140; }
  td.cell.light { background: linear-gradient(180deg, #fbfcfe, #f0f2f6); box-shadow: inset 0 0 0 1px #dfe3ea; }
  .pill { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 7px 14px 7px 10px; font-size: 13px; }
  .cell.dark .pill { background: rgba(255,255,255,0.06); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); color: #e8eaed; }
  .cell.light .pill { background: rgba(255,255,255,0.9); box-shadow: inset 0 0 0 1px rgba(20,30,50,0.12); color: #2b2f36; }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex: none; opacity: 0.9; }
  .text { white-space: nowrap; }
  .ornament { --dds-size: 20px; }
</style>
<link rel="stylesheet" href="../src/client/ornament.module.css"/>
</head>
<body>
<div class="wrap">
  <h1>dsh-deep-dive-skins</h1>
  <p class="sub">Pre-deep-dive ornaments on the DSH turn-status row (dark / light)</p>
  <table>
    <tr><th></th><th class="dark" style="color:#9aa3b2;text-align:left;font-size:12px;padding-left:20px">DARK</th><th class="light" style="color:#2b2f36;text-align:left;font-size:12px;padding-left:20px">LIGHT</th></tr>
${rows}
  </table>
</div>
</body>
</html>
`
await writeFile(join(ROOT, 'preview/preview.html'), html)
console.log('wrote preview/preview.html')
