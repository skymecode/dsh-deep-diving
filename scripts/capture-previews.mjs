#!/usr/bin/env node
/**
 * Capture preview screenshots of every skin (dark + light) plus one combined
 * hero shot. Requires playwright + chromium (the dsh-web-ui checkout has both).
 * Usage: node scripts/capture-previews.mjs
 */
import { createRequire } from 'node:module'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SKINS } from '../src/client/skins.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
// Resolve playwright from the dsh-web-ui checkout (this repo does not ship it).
const require = createRequire('/Users/jackmojong/dsh-web-ui/package.json')
const { chromium } = require('playwright')

await mkdir(join(ROOT, 'preview'), { recursive: true })

const browser = await chromium.launch({
  // Use the locally installed headless shell (playwright 1.62 in dsh-web-ui
  // expects a newer cache revision than the one present on this machine).
  executablePath: '/Users/jackmojong/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 })
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.goto('file://' + join(ROOT, 'preview/preview.html'))
await page.waitForSelector('.pill')

// Hero: the whole table.
await page.locator('table').screenshot({ path: join(ROOT, 'preview/deep-diving-skins.png') })

// Per skin: dark + light pills.
for (const skin of SKINS) {
  for (const theme of ['dark', 'light']) {
    const row = page.locator(`[data-preview-row="${skin.id}-${theme}"]`)
    await row.screenshot({ path: join(ROOT, `preview/${skin.id}-${theme}.png`) })
  }
}
await browser.close()
console.log('captured', SKINS.length * 2 + 1, 'screenshots into preview/')
