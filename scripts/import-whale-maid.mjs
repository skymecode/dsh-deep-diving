// Reproduce the bundled, transparent CSS sprite strips from upstream videos.
// Requires ffmpeg with libvpx-vp9 and PNG. See assets/whale-maid/NOTICE.md.
import { mkdir, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

const revision = 'e1ff8c1e4001878cbb80441262d530e16541f138'
const actions = {
  idle: '待机呼吸休闲', think: '工作状态-思考冒泡', run: '原地左转奔跑',
  snow: '堆雪人', wave: '点击回应-元气挥手', code: '写代码',
  bubbles: '鲸鱼吐泡泡特效', dance: '轻快摇摆舞',
}
const output = new URL('../assets/whale-maid/', import.meta.url)
const scratch = await mkdtemp(join(tmpdir(), 'dds-whale-maid-'))
await mkdir(output, { recursive: true })
for (const [id, action] of Object.entries(actions)) {
  if (existsSync(new URL(`${id}.webp`, output))) continue
  const url = `https://raw.githubusercontent.com/PC2005-cloud/dsh-pet/${revision}/dsh-pet/assets/webm/${encodeURIComponent(action)}.webm`
  const input = join(scratch, `${id}.webm`)
  execFileSync('curl', ['-fsSL', '--retry', '2', '--max-time', '60', url, '-o', input])
  // Explicit libvpx decoder preserves VP9 alpha. Full 10s at 10fps; a square
  // center crop removes the transparent margins of the 16:9 source canvas.
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-c:v', 'libvpx-vp9', '-i', input,
    '-vf', 'fps=10,crop=360:360:140:0,scale=128:128:flags=lanczos,tpad=stop_mode=clone:stop_duration=10,tile=1x100',
    '-frames:v', '1', '-c:v', 'png', join(scratch, `${id}.png`)])
  await sharp(join(scratch, `${id}.png`)).webp({ quality: 82, alphaQuality: 90 }).toFile(new URL(`${id}.webp`, output).pathname)
  console.log(`Imported ${id} (${action})`)
}
