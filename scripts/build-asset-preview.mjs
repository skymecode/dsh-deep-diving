/** A contact sheet of real sprite frames, not a browser screenshot. */
import sharp from 'sharp'
const actions = { think: 'THINKING', run: 'RUNNING', snow: 'SNOWMAN', wave: 'WAVING', code: 'CODING', bubbles: 'BUBBLES', dance: 'DANCING', idle: 'BREATHING' }
const layers = []
for (const [index, [id, label]] of Object.entries(actions).entries()) {
  const x = (index % 4) * 256, y = Math.floor(index / 4) * 190
  layers.push({ left: x, top: y, input: Buffer.from(`<svg width="256" height="190"><rect width="128" height="150" fill="#182030"/><rect x="128" width="128" height="150" fill="#f3f6fc"/><rect y="150" width="256" height="40" fill="#101522"/><text x="128" y="175" text-anchor="middle" fill="#c4d5f3" font-family="sans-serif" font-size="13">${label}</text></svg>`) })
  const frame = await sharp(new URL(`../assets/whale-maid/${id}.webp`, import.meta.url).pathname).extract({ left: 0, top: 30 * 128, width: 128, height: 128 }).png().toBuffer()
  layers.push({ left: x, top: y + 11, input: frame }, { left: x + 128, top: y + 11, input: frame })
}
await sharp({ create: { width: 1024, height: 380, channels: 4, background: '#101522' } }).composite(layers).png().toFile(new URL('../preview/whale-maid-actions.png', import.meta.url).pathname)
console.log('Wrote preview/whale-maid-actions.png')
