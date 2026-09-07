# dsh-deep-dive-skins

[中文](README.zh.md) · [Releases](https://github.com/skymecode/dsh-deep-diving/releases)

An animated blue whale maid for the DeepSeek Harness Web GUI's **Deep diving…**
status row. She thinks, runs, builds a snowman and more, changing actions
throughout the same turn. Four vector skins remain available.

## Preview

![Eight whale-maid actions on dark and light backgrounds](preview/whale-maid-actions.png)

Real sprite frames, not a browser screenshot. Run `pnpm preview` for a live
preview with the **release bundle and actual settings card** over a simulated
Host scope. Start/end a turn, change settings and test plugin unloading there.

## Features

- Default `whale-maid`: eight transparent, 100-frame animations, 10fps each.
- Continuous rotation within one turn: think → run → snow → wave → code →
  bubbles → dance → idle. Default interval: 10 seconds (adjustable to 60).
- Turn rotation off to loop one action. `random` changes the skin at each
  interval without repeating the previous skin.
- Existing `whale`, `dafeiyu`, `catgirl`, and `mermaid` vector skins retained.
- Live settings: enable/disable, skin, size (14–96px), first action, rotation,
  interval and optional localized status text.
- Handles both `Deep diving...` and the current Chinese `深度求索中...` row.
- Reduced motion stops animation/rotation; hidden tabs pause. Turn completion
  and unloading clean up timers, observers, listeners and changed text.
- Reuses dsh-pet's working-whale marker to avoid stacked ornaments, restoring
  displaced ornaments on disable. No Harness source patch or pet server needed.
- Sprites are bundled locally: no runtime requests to GitHub/CDNs.

## Install / upgrade

Install the GitHub Release tarball (npm publication is not required):

```sh
dsh plugin --profile web add https://github.com/skymecode/dsh-deep-diving/releases/download/v0.2.0/dsh-deep-dive-skins-0.2.0.tgz
```

Use your own profile name if it is not `web`. Restart `dsh web` and refresh the
page after upgrading. Existing settings are preserved: choose **Blue whale
maid**, enable **Continuous rotation**, and set **48–64px** if you previously
saved a vector skin or a smaller size.

Development install:

```sh
git clone https://github.com/skymecode/dsh-deep-diving.git
cd dsh-deep-diving
pnpm install --frozen-lockfile
pnpm build
dsh plugin --profile web add link:$(pwd)
```

## Compatibility

Current SDK/type-check baseline: official
[`dsh-v0.1.3-alpha.2`](https://github.com/deepseek-ai/deepseek-harness/tree/dsh-v0.1.3-alpha.2),
the newest tag checked on 2026-09-08. Peer ranges also accept `0.1.2-rc.1`,
`0.1.1-rc.2`, `0.1.1-rc.1`, `0.1.0-rc.8` and `0.1.0-rc.7`.

- Settings cards register using `key: 'deep-dive-skins'` on
  `settings.plugin.item`; no list-slot `id`/`order`.
- No dependency on the removed `dsh-client-runtime` browser module or the
  removed host `installSettingsSection` / `settingsNamespace` exports.
- Host registers through `ctx.settings.register`; the client uses the shared
  scope `set`/`unset` contract with read-back. It does not confuse legacy
  `{field}` batch operations with modern `{path}` operations.
- Uses `settingsScope` normally, with the legacy `webUiSettings` binder when
  installed. Existing settings continue to work; new fields have defaults.

Automated checks exercise the built factory, both binder contracts, the real
React form, SDK host registration and DOM lifecycle. Host registration/unload
was also checked with published 0.1.1-rc.2 and 0.1.2-rc.1 provider modules.
These are not a full
end-to-end conversation test on every historical Harness version. Browser
visual QA for this change was unavailable (Tabbit runtime disconnected).

## Settings

| Field | Values / default |
| --- | --- |
| Enable plugin | On |
| Skin | `whale-maid` / `whale` / `dafeiyu` / `catgirl` / `mermaid` / `random` |
| Ornament size | 14–96px, default 48 |
| Starting action | `think` / `run` / `snow` / `wave` / `code` / `bubbles` / `dance` / `idle` |
| Continuous rotation | On; off still loops the selected animation |
| Rotation interval | 10–60 seconds, default 10 |
| Replace status text | Off; when on, follows the UI language |

## Development

```sh
pnpm typecheck
pnpm test          # behavior, settings writes, keyed registration, peer ranges
pnpm build         # declarations + host ESM + lazy browser factory
pnpm test:bundle   # shipped bundle + React settings + real Host SDK provider
pnpm test:assets   # alpha, frame dimensions, animation and size budget
pnpm preview       # local interactive release-bundle preview
```

`scripts/import-whale-maid.mjs` reproduces sprites from pinned upstream videos
(requires ffmpeg with libvpx-vp9 and PNG support; existing outputs are skipped).
`node scripts/build-asset-preview.mjs` regenerates the frame contact sheet.
Sprites use CSS `steps(100)` and a single rotation timer per mounted plugin.
The ~4MB browser factory includes all eight sprites to work with old and new
loaders without static-asset URL assumptions.

## Asset source and licenses

The matching blue-haired whale-maid animations were found in
[`PC2005-cloud/dsh-pet`](https://github.com/PC2005-cloud/dsh-pet/tree/e1ff8c1e4001878cbb80441262d530e16541f138)
and converted from transparent VP9 videos into compact WebP sprite strips.
No user-uploaded screenshot is distributed in the plugin.

**Important: upstream assets allow open-source use but prohibit commercial
use.** This restriction applies to the bundled whale-maid images and embedded
copies; they are **not Apache-2.0 assets**. See
[asset attribution and terms](assets/whale-maid/NOTICE.md) and contact the
upstream author for commercial permission.

Plugin code is Apache-2.0. Vendored build/card files retain their dsh-web-ui
provenance; see file headers and [LICENSE](LICENSE).
