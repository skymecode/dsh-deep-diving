# dsh-deep-dive-skins

Pre-deep-dive ornaments for the DSH Web GUI turn-status row. When the shell
shows its "Deep diving..." status, this plugin swaps the little spouting
whale (or the ornament dsh-pet adds) for a chosen anime skin — whale-girl
variant, cat-girl or mermaid — with a two-beat choreography: a surface
prepare bob, then a gentle dive sway with rising bubbles.

Built as an official DeepSeek Harness cordis bundle: host half registers one
settings namespace, browser half patches the status row. No dsh source
changes, hot-swappable through the profile mechanism.

## Features

- Replaces the ornament ahead of the native "Deep diving..." status row
  (`[data-chat-flow] [role="status"][aria-live="polite"]`).
- Three bundled skins (placeholder vector art — swap the SVGs in
  `src/client/skins.ts` for real sprites):
  - **whale** — whale-girl dive, DeepSeek blue
  - **catgirl** — cat-girl dive, sakura pink
  - **mermaid** — mermaid dive, ocean cyan
- **random** mode picks a skin per status-row appearance.
- Settings card (Settings -> plugin configuration): master switch, skin,
  ornament size (14-40 px), and optional status-text replacement
  ("Deep diving..." becomes a skin-specific line).
- Coexists with dsh-pet: the ornament carries the same marker dsh-pet's
  working-whale checks, so the two plugins never stack.
- `prefers-reduced-motion` stops the animation and keeps the figure static.

## Install

From npm once published:

```sh
dsh plugin --profile web add dsh-deep-dive-skins@latest
```

From this repository (development):

```sh
git clone <your-repo-url> dsh-deep-dive-skins
cd dsh-deep-dive-skins
pnpm install && pnpm build
dsh plugin --profile web add link:$(pwd)
```

Restart `dsh web` afterwards. In link mode, rebuild (`pnpm build`) and
refresh the page after code changes — no reinstall needed.

## Settings

| Field | Meaning |
| --- | --- |
| Enable plugin | Master switch; off leaves the status row untouched |
| Skin | whale / catgirl / mermaid / random |
| Ornament size | Height in px (14-40, default 20) |
| Replace status text | Swap "Deep diving..." for the skin's line (zh/en follows the UI language) |

## How it works

- The browser half observes the turn-status row with a MutationObserver and
  claims the slot dsh-pet's working-whale uses: it removes any existing
  `[data-dsh-pet-working-whale]` ornament, inserts its own
  `[data-dsh-deep-dive-skin]` ornament (also marked
  `data-dsh-pet-working-whale` so dsh-pet skips), and self-heals when React
  re-renders the row.
- Each skin is pure data in `src/client/skins.ts`: id, labels, accent color
  and an inline SVG figure (currentColor).
- Animation is pure CSS: `dds-prepare` (one bob) then `dds-sway` (infinite
  dive loop) plus rising bubbles, in `src/client/ornament.module.css`.
- Settings are read live on every mutation; changing a value applies on the
  next status-row render.

## Development

```sh
pnpm build        # tsc (types) + tsdown (node half + browser bundle)
pnpm test         # vitest (skin registry + ornament mount)
pnpm typecheck    # type check only
```

The browser bundle follows the `window.__ModuleLoader__.load` contract; the
build preset is vendored from the dsh-web-ui monorepo
(`build/tsdown.client.ts` + `build/web-platform.ts`, Apache-2.0), and the
settings card chrome is vendored from `shared/client/settings`.

## Roadmap

- Real sprite art for each skin (replace the placeholder SVGs).
- Phase-aware choreography driven by `/api/pet/state` (waiting = surface
  bob, thinking = dive, review = ascend, done = splash).
- An asset pack (decoration.json strips) for the pet status bubble, pending
  dsh-pet decoration-id selection support.
- Community-plugin index registration (community.json PR) once published.

## License

Apache-2.0. Vendored build/card files retain their dsh-web-ui provenance;
see the file headers and LICENSE.
