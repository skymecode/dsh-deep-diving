import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

const ids = ['think', 'run', 'snow', 'wave', 'code', 'bubbles', 'dance', 'idle']
for (const id of ids) {
  const path = new URL(`../assets/whale-maid/${id}.webp`, import.meta.url)
  const meta = await sharp(path.pathname).metadata()
  assert.equal(meta.width, 128, id)
  assert.equal(meta.height, 12_800, id)
  assert.equal(meta.hasAlpha, true, id)
  const first = await sharp(path.pathname).extract({ left: 0, top: 0, width: 128, height: 128 }).raw().toBuffer()
  const middle = await sharp(path.pathname).extract({ left: 0, top: 6400, width: 128, height: 128 }).raw().toBuffer()
  assert.notDeepEqual(first, middle, `${id}: animation must contain different frames`)
  assert.ok((await readFile(path)).length < 500_000, `${id}: asset budget`)
}
console.log('PASS 8 transparent WebP strips: 100 frames, 128px, <500KB each')
