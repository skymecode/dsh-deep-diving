/**
 * dsh-deep-dive-skins browser half — mounts the pre-dive ornament onto the
 * native DSH turn-status row and contributes its settings card.
 *
 * The official conversation client owns the "Deep diving..." status text.
 * This plugin observes the same row dsh-pet's working-whale decorates and
 * claims the slot: the selected skin ornament replaces the spouting whale
 * (or dsh-pet's ornament) without touching the shell's lifecycle. Settings
 * are read live on every mutation, so a skin/size/label change applies on
 * the next status-row render; toggling the plugin off removes our ornaments
 * and restores whatever the shell or dsh-pet renders.
 *
 * @module dsh-deep-dive-skins/client
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { SettingsScope, SettingsScopeSpec } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the settings-surface SlotMap merge (the 'settings.*'
// holes) and the ctx.settingsScope Context merge.
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the keyed settings-card slot declared by the Plugins
// settings surface in DSH rc.7 and newer.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import { mountDiveSkins, type DiveSkinMount } from './ornament.ts'
import { DeepDiveSkinsCard, DeepDiveSkinsCardController, type DeepDiveSkinsSettings } from './SettingsCard.tsx'
import { en, zh, type DeepDiveSkinsKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** deep-dive-skins settings-card copy. */
    'deep-dive-skins': DeepDiveSkinsKey
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /**
     * Optional rc.6 compatibility binder provided by dsh-web-ui-settings;
     * absent when that group plugin is not installed, so callers fall back to
     * the official settings scope.
     */
    webUiSettings?: { bind<S>(spec: SettingsScopeSpec<S>): SettingsScope<S> }
  }
}

/** Locale namespace of the browser half. */
export const NS = 'deep-dive-skins' as const

/** Required services: slots for the settings card, settings scope for config, locale for copy. */
export const inject = ['slots', 'locale', 'settingsScope']

/** Apply the browser half. */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'deep-dive-skins: dictionaries')

  const binder = ctx.get('webUiSettings') ?? ctx.settingsScope
  const settingsScope = binder.bind<DeepDiveSkinsSettings>({ namespace: NS })
  const read = (): DeepDiveSkinsSettings | undefined => {
    const snapshot = settingsScope.getSnapshot()
    return snapshot.status === 'ready' ? snapshot.value : undefined
  }
  const enabled = (): boolean => {
    const snapshot = settingsScope.getSnapshot()
    return snapshot.status === 'ready'
      ? snapshot.value?.enabled ?? true
      : snapshot.status === 'unavailable'
  }

  // The ornament mount: while the plugin is enabled, observe the turn-status
  // row and swap in the selected skin. Settings refresh existing rows without
  // restarting the current animation unless the chosen skin/action changes.
  let disposeOrnament: DiveSkinMount | undefined
  const syncOrnament = (): void => {
    if (enabled() && disposeOrnament === undefined) {
      disposeOrnament = mountDiveSkins(document.body, () => {
        const value = read()
        return {
          enabled: value?.enabled ?? true,
          skin: value?.skin ?? 'whale-maid',
          size: value?.size ?? 48,
          label: value?.label ?? false,
          rotate: value?.rotate ?? true,
          interval: value?.interval ?? 10,
          action: value?.action ?? 'think',
        }
      })
    } else if (!enabled() && disposeOrnament !== undefined) {
      disposeOrnament()
      disposeOrnament = undefined
    } else {
      disposeOrnament?.refresh()
    }
  }
  ctx.effect(() => {
    const unsubscribe = settingsScope.subscribe(syncOrnament)
    syncOrnament()
    return () => {
      unsubscribe()
      disposeOrnament?.()
      disposeOrnament = undefined
    }
  }, 'deep-dive-skins: ornament lifecycle')

  // Plugin configuration card: one staged form over the deep-dive-skins
  // namespace, contributed to the official plugin-configuration page.
  const controller = new DeepDiveSkinsCardController(settingsScope)
  ctx.effect(() => () => controller.dispose(), 'deep-dive-skins: settings form')
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: NS,
    locale: NS,
    inject: () => controller.inject(),
  }, DeepDiveSkinsCard))
}
