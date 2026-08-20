/**
 * dsh-deep-dive-skins host half — one settings namespace, nothing else.
 *
 * The browser half ('./client') patches the official DSH turn-status row:
 * when the shell shows its "Deep diving..." status it swaps the spouting
 * whale ornament (or the one dsh-pet adds) for a selected anime skin. All
 * behavior is client-side DOM; the host only registers the namespace the
 * settings card edits, so toggling or changing the skin takes effect without
 * a restart.
 * @module dsh-deep-dive-skins
 */

import { Context } from '@deepseek-ai/cordis'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import z from 'schemastery'

/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export const name = 'deep-dive-skins'

/** Settings namespace of the plugin (the browser half spells the same value). */
export const DEEP_DIVE_SKINS_NS = 'deep-dive-skins'

/** Ornament height bounds (px) the settings card and the client clamp to. */
export const ORNAMENT_SIZE_MIN = 14
export const ORNAMENT_SIZE_MAX = 40
export const ORNAMENT_SIZE_DEFAULT = 20

/** Settings the card edits and the ornament reads. skin is a free string on purpose: the client clamps unknown values to the default skin. */
export interface DeepDiveSkinsSettings {
  /** Master switch. */
  enabled?: boolean
  /** Skin id ('whale' | 'catgirl' | 'mermaid' | 'random'). */
  skin?: string
  /** Ornament height in px. */
  size?: number
  /** Replace the 'Deep diving...' text with the skin's own line. */
  label?: boolean
}

/** Section schema: defaults make a fresh install render the whale variant. */
export function makeDeepDiveSkinsSchema() {
  return z.object({
    enabled: z.boolean().default(true),
    skin: z.string().default('whale'),
    size: z.number().step(1).min(ORNAMENT_SIZE_MIN).max(ORNAMENT_SIZE_MAX).default(ORNAMENT_SIZE_DEFAULT),
    label: z.boolean().default(false),
  })
}

/** Register the settings namespace. No services are required. */
export const apply = (ctx: Context, config: DeepDiveSkinsSettings = {}): void => {
  const base: DeepDiveSkinsSettings = {
    enabled: config.enabled ?? true,
    skin: config.skin ?? 'whale',
    size: config.size ?? ORNAMENT_SIZE_DEFAULT,
    label: config.label ?? false,
  }
  let current: () => DeepDiveSkinsSettings = () => base
  installSettingsSection(
    ctx,
    settingsNamespace(DEEP_DIVE_SKINS_NS),
    makeDeepDiveSkinsSchema(),
    base,
    {
      setSource: (source) => { current = source },
      // The browser half observes the namespace directly; the host has no
      // derived behavior to re-sync, so onChange only re-reads the source.
      onChange: () => { current() },
    },
  )
}
