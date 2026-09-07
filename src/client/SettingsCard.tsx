/**
 * The deep-dive-skins settings card: master switch, skin picker, ornament
 * size and the label-replacement toggle. Registers into the official
 * 'settings.plugin.item' seat, bound to the 'deep-dive-skins' settings
 * namespace the host half registers.
 */

import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { SnapshotStore } from './snapshot-store.ts'
import { BooleanField, ChoiceField, PluginSettingsCard, ValueField } from './PluginSettingsCard.tsx'
import { booleanField, CardForm, choiceField, numberField, type CardActions, type CardShell, type FieldState } from './settings-form.ts'
import { SKINS, SKIN_CHOICES } from './skins.ts'
import { MAID_ACTION_IDS } from './whale-maid.ts'
import type { DeepDiveSkinsKey } from './locales.ts'

/** The deep-dive-skins fields this card edits (the namespace full schema). */
export interface DeepDiveSkinsSettings {
  /** Master switch for the plugin. */
  enabled?: boolean
  /** Registered skin id, or random. */
  skin?: string
  /** Ornament height in px. */
  size?: number
  /** Replace the 'Deep diving...' status text. */
  label?: boolean
  rotate?: boolean
  interval?: number
  action?: string
}

/** What the deep-dive-skins card renders. */
export interface DeepDiveSkinsCardState extends CardShell {
  enabled: FieldState
  skin: FieldState
  size: FieldState
  label: FieldState
  rotate: FieldState
  interval: FieldState
  action: FieldState
}

/** The registration-side face the card slot entry injects. */
export interface DeepDiveSkinsCardFace extends CardActions {
  hooks: {
    /** Card snapshot bound by the renderer as useDeepDiveSkinsCard. */
    deepDiveSkinsCard: SnapshotStore<DeepDiveSkinsCardState>
  }
}

/** Bridges the 'deep-dive-skins' scope onto the card staged form. */
export class DeepDiveSkinsCardController {
  private readonly form: CardForm<DeepDiveSkinsSettings>
  private readonly store: SnapshotStore<DeepDiveSkinsCardState>

  /** @param scope - the bound settings scope for the deep-dive-skins namespace. */
  constructor(scope: SettingsScope<DeepDiveSkinsSettings>) {
    this.form = new CardForm(scope, [
      booleanField('enabled'),
      choiceField('skin', [...SKIN_CHOICES]),
      numberField('size', { integer: true, min: 14, max: 96 }),
      booleanField('label'),
      booleanField('rotate'),
      numberField('interval', { integer: true, min: 10, max: 60 }),
      choiceField('action', MAID_ACTION_IDS),
    ])
    this.store = this.form.bind(() => this.projection())
  }

  private projection(): DeepDiveSkinsCardState {
    return {
      ...this.form.shell(),
      enabled: this.form.field('enabled'),
      skin: this.form.field('skin'),
      size: this.form.field('size'),
      label: this.form.field('label'),
      rotate: this.form.field('rotate'),
      interval: this.form.field('interval'),
      action: this.form.field('action'),
    }
  }

  /** Build the face the card slot registration injects. */
  inject(): DeepDiveSkinsCardFace {
    return { hooks: { deepDiveSkinsCard: this.store }, ...this.form.actions() }
  }

  dispose(): void { this.form.dispose() }
}

/** Props the renderer binds for the deep-dive-skins card. */
export type DeepDiveSkinsCardProps =
  PropsRuntime<'settings.plugin.item'>
  & PropsLocale<'deep-dive-skins'>
  & InjectFace<DeepDiveSkinsCardFace>

/** Locale key of one skin choice. */
function skinLabelKey(id: string): DeepDiveSkinsKey {
  switch (id) {
    case 'whale': return 'skin.whale'
    case 'whale-maid': return 'skin.whale-maid'
    case 'dafeiyu': return 'skin.dafeiyu'
    case 'catgirl': return 'skin.catgirl'
    case 'mermaid': return 'skin.mermaid'
    default: return 'skin.random'
  }
}

/**
 * Render the deep-dive-skins card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export function DeepDiveSkinsCard(props: DeepDiveSkinsCardProps) {
  const { t } = props
  const state = props.useDeepDiveSkinsCard(snapshot => snapshot)
  const disabled = !state.writable
  const fieldProps = {
    overriddenLabel: t('settings.overridden'),
    resetLabel: t('settings.reset'),
    invalidLabel: t('settings.invalidNumber'),
    disabled,
  }
  const skinChoices = SKINS.map(skin => ({ value: skin.id, label: t(skinLabelKey(skin.id)) }))
  return (
    <PluginSettingsCard
      t={t}
      titleKey="settings.title"
      descriptionKey="settings.description"
      state={state}
      onSave={props.save}
      onDiscard={props.discard}
    >
      <BooleanField
        id="settings-deep-dive-skins-enabled"
        label={t('settings.enabled')}
        hint={t('settings.enabledHint')}
        inheritLabel={t('settings.inherit')}
        onLabel={t('settings.on')}
        offLabel={t('settings.off')}
        {...fieldProps}
        {...state.enabled}
        onEdit={(text) => { props.edit('enabled', text) }}
        onReset={() => { props.resetField('enabled') }}
      />
      <ChoiceField
        id="settings-deep-dive-skins-skin"
        label={t('settings.skin')}
        hint={t('settings.skinHint')}
        inheritLabel={t('settings.inherit')}
        choices={[...skinChoices, { value: 'random', label: t('skin.random') }]}
        {...fieldProps}
        {...state.skin}
        onEdit={(text) => { props.edit('skin', text) }}
        onReset={() => { props.resetField('skin') }}
      />
      <ValueField
        id="settings-deep-dive-skins-size"
        label={t('settings.size')}
        hint={t('settings.sizeHint')}
        numeric
        {...fieldProps}
        {...state.size}
        onEdit={(text) => { props.edit('size', text) }}
        onReset={() => { props.resetField('size') }}
      />
      <ChoiceField
        id="settings-deep-dive-skins-action"
        label={t('settings.action')}
        hint={t('settings.actionHint')}
        inheritLabel={t('settings.inherit')}
        choices={MAID_ACTION_IDS.map(id => ({ value: id, label: t(`action.${id}`) }))}
        {...fieldProps}
        {...state.action}
        onEdit={(text) => { props.edit('action', text) }}
        onReset={() => { props.resetField('action') }}
      />
      <BooleanField
        id="settings-deep-dive-skins-rotate"
        label={t('settings.rotate')}
        hint={t('settings.rotateHint')}
        inheritLabel={t('settings.inherit')}
        onLabel={t('settings.on')}
        offLabel={t('settings.off')}
        {...fieldProps}
        {...state.rotate}
        onEdit={(text) => { props.edit('rotate', text) }}
        onReset={() => { props.resetField('rotate') }}
      />
      <ValueField
        id="settings-deep-dive-skins-interval"
        label={t('settings.interval')}
        hint={t('settings.intervalHint')}
        numeric
        {...fieldProps}
        {...state.interval}
        onEdit={(text) => { props.edit('interval', text) }}
        onReset={() => { props.resetField('interval') }}
      />
      <BooleanField
        id="settings-deep-dive-skins-label"
        label={t('settings.label')}
        hint={t('settings.labelHint')}
        inheritLabel={t('settings.inherit')}
        onLabel={t('settings.on')}
        offLabel={t('settings.off')}
        {...fieldProps}
        {...state.label}
        onEdit={(text) => { props.edit('label', text) }}
        onReset={() => { props.resetField('label') }}
      />
    </PluginSettingsCard>
  )
}
