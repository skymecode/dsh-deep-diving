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
import type {} from '@deepseek-ai/dsh-settings'
import z from '@deepseek-ai/schemastery'

/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export const name = 'deep-dive-skins'

/** Settings namespace of the plugin (the browser half spells the same value). */
export const DEEP_DIVE_SKINS_NS = 'deep-dive-skins'

/** Ornament height bounds (px) the settings card and the client clamp to. */
export const ORNAMENT_SIZE_MIN = 14
export const ORNAMENT_SIZE_MAX = 96
export const ORNAMENT_SIZE_DEFAULT = 48

/** Settings the card edits and the ornament reads. skin is a free string on purpose: the client clamps unknown values to the default skin. */
export interface DeepDiveSkinsSettings {
  /** Master switch. */
  enabled?: boolean
  /** Skin id; unknown values fall back to whale-maid. */
  skin?: string
  /** Ornament height in px. */
  size?: number
  /** Replace the 'Deep diving...' text with the skin's own line. */
  label?: boolean
  /** Rotate to another skin/action during the same turn. */
  rotate?: boolean
  /** Seconds between action changes (10-60). */
  interval?: number
  action?: string
}

/** Section schema: fresh installs rotate the blue whale-maid animations. */
export function makeDeepDiveSkinsSchema() {
  return z.object({
    enabled: z.boolean().default(true),
    skin: z.string().default('whale-maid'),
    size: z.number().step(1).min(ORNAMENT_SIZE_MIN).max(ORNAMENT_SIZE_MAX).default(ORNAMENT_SIZE_DEFAULT),
    label: z.boolean().default(false),
    rotate: z.boolean().default(true),
    interval: z.number().step(1).min(10).max(60).default(10),
    action: z.string().default('think'),
  })
}

/** Register the settings namespace. No services are required. */
export const apply = (ctx: Context, config: DeepDiveSkinsSettings = {}): void => {
  const base: DeepDiveSkinsSettings = {
    enabled: config.enabled ?? true,
    skin: config.skin ?? 'whale-maid',
    size: config.size ?? ORNAMENT_SIZE_DEFAULT,
    label: config.label ?? false,
    rotate: config.rotate ?? true,
    interval: config.interval ?? 10,
    action: config.action ?? 'think',
  }
  // The provider API exists on legacy rc.7 as well as current Harness.
  // The removed installSettingsSection/settingsNamespace exports are avoided.
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(DEEP_DIVE_SKINS_NS, makeDeepDiveSkinsSchema(), { base })
  })
}
