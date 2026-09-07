# Blue whale maid / 蓝色大肥鱼

Source: https://github.com/PC2005-cloud/dsh-pet
Revision: `e1ff8c1e4001878cbb80441262d530e16541f138`
Original files: `dsh-pet/assets/webm/` (named in `scripts/import-whale-maid.mjs`).

The upstream README's license section separately licenses its animation,
prompt and source-video assets: **allowed for open-source use; commercial
use prohibited**. These bundled images retain that restriction and are NOT
covered by this plugin's Apache-2.0 code license. Contact the upstream author
for commercial permission.

上游 README 的许可说明：素材（动画/提示词/源视频）允许开源使用，禁止商用。
本目录素材沿用该限制，不属于本插件代码的 Apache-2.0 许可范围；商用请联系上游作者。

Adaptation: transparent VP9 videos decoded to 100-frame, 10fps WebP sprite
strips, center-cropped and resized for inline status ornaments. No runtime
downloads. Reproduce with `node scripts/import-whale-maid.mjs` (ffmpeg required).

Upstream code license (retained for attribution):

MIT License

Copyright (c) 2026 PC2005-cloud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
