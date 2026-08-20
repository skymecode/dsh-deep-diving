/**
 * The 'deep-dive-skins' namespace dictionaries: copy for the plugin settings
 * card and the per-skin labels.
 */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'settings.title': 'Deep Dive 前奏皮肤',
  'settings.description': '替换状态行 "Deep diving..." 前的小鲸鱼喷水：鲸鱼娘、猫娘与人鱼三套下潜前奏皮肤。',
  'settings.enabled': '启用插件',
  'settings.enabledHint': '关闭后不再触碰状态行，恢复官方或 dsh-pet 的原版装饰。',
  'settings.skin': '皮肤',
  'settings.skinHint': '每次进入 "Deep diving..." 状态时使用的皮肤；随机 = 每次出现随机挑一套。',
  'settings.size': '装饰大小',
  'settings.sizeHint': '装饰高度（像素），14-40，默认 20。',
  'settings.label': '替换状态文案',
  'settings.labelHint': '把官方 "Deep diving..." 换成每套皮肤专属文案；关闭则保留原文。',
  'skin.whale': '鲸鱼娘下潜',
  'skin.dafeiyu': '大肥鱼',
  'skin.catgirl': '猫娘入水',
  'skin.mermaid': '人鱼入海',
  'skin.random': '随机',
  'settings.overridden': '已覆盖',
  'settings.reset': '恢复默认',
  'settings.notExposed': '当前 DSH 版本未向设置页暴露本插件的配置命名空间，表单不可用。可编辑 ~/.dsh/settings.yaml 直接配置，或为 dsh-host-apiproxy 的 WEB_SETTINGS_NAMESPACES 白名单补充本命名空间后重启。',
  'settings.readOnly': '当前部署的设置只读。',
  'settings.inherit': '继承',
  'settings.on': '开',
  'settings.off': '关',
  'settings.expand': '展开设置',
  'settings.collapse': '收起设置',
  'settings.save': '保存',
  'settings.saving': '保存中…',
  'settings.discard': '放弃',
  'settings.unsaved': '未保存',
  'settings.saveFailed': '部署未接受这些值，已保留供你修改。',
  'settings.invalidNumber': '请输入数字，留空则使用默认值。',
} satisfies Record<string, string>

/** The deep-dive-skins key union. */
export type DeepDiveSkinsKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'settings.title': 'Deep Dive Prelude Skins',
  'settings.description': 'Swap the spouting whale ahead of the "Deep diving..." status row for anime prelude skins: whale-girl, cat-girl and mermaid.',
  'settings.enabled': 'Enable plugin',
  'settings.enabledHint': 'When off the status row is left untouched, restoring the official or dsh-pet ornament.',
  'settings.skin': 'Skin',
  'settings.skinHint': 'Skin used each time the "Deep diving..." status appears; random picks one per appearance.',
  'settings.size': 'Ornament size',
  'settings.sizeHint': 'Ornament height in pixels, 14-40; default 20.',
  'settings.label': 'Replace status text',
  'settings.labelHint': 'Replaces the official "Deep diving..." with a skin-specific line; off keeps the original text.',
  'skin.whale': 'Whale-girl dive',
  'skin.dafeiyu': 'Big fat fish',
  'skin.catgirl': 'Cat-girl dive',
  'skin.mermaid': 'Mermaid dive',
  'skin.random': 'Random',
  'settings.overridden': 'Overridden',
  'settings.reset': 'Reset to default',
  'settings.notExposed': "This DSH version does not expose this plugin's settings namespace to the configuration page, so the form is unavailable. Edit ~/.dsh/settings.yaml directly, or add the namespace to dsh-host-apiproxy's WEB_SETTINGS_NAMESPACES allowlist and restart.",
  'settings.readOnly': 'This deployment stores settings read-only.',
  'settings.inherit': 'Inherit',
  'settings.on': 'On',
  'settings.off': 'Off',
  'settings.expand': 'Show settings',
  'settings.collapse': 'Hide settings',
  'settings.save': 'Save',
  'settings.saving': 'Saving…',
  'settings.discard': 'Discard',
  'settings.unsaved': 'Unsaved',
  'settings.saveFailed': 'The deployment did not accept these values; they were left for you to correct.',
  'settings.invalidNumber': 'Enter a number, or leave blank to use the default.',
} satisfies Record<DeepDiveSkinsKey, string>
