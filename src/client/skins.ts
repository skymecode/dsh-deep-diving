/**
 * Skin registry for the pre-deep-dive ornament.
 *
 * Each skin is pure data: an id, display names and a status label (used when
 * the 'label' setting replaces the shell's "Deep diving..." text), an accent
 * color, and an inline SVG figure drawn with currentColor. The figures here
 * are hand-authored placeholder art — swap them for real sprites without
 * touching any logic.
 * @module dsh-deep-dive-skins/skins
 */

export interface DiveSkin {
  /** Lowercase kebab id; the settings 'skin' value. */
  readonly id: string
  readonly nameZh: string
  readonly nameEn: string
  /** Label that replaces 'Deep diving...' when the label setting is on. */
  readonly labelZh: string
  readonly labelEn: string
  /** Accent color for the figure and bubbles. */
  readonly accent: string
  /** Inline SVG figure, viewBox 0 0 40 32, fill via currentColor. */
  readonly svg: string
}

/** The skin ids the settings card offers; 'random' picks per status row. */
export const SKIN_CHOICES = ['whale', 'catgirl', 'mermaid', 'random'] as const

/** Fallback skin when a stored id is unknown or missing. */
export const DEFAULT_SKIN_ID = 'whale'

const WHALE_SVG = '<svg viewBox="0 0 40 32" focusable="false" aria-hidden="true">'
  + '<path fill="currentColor" d="M6.5 18.5 C6.5 11.8 11.6 7.2 17.8 7.2 C23.6 7.2 28.4 10.2 30.3 15.2 C31.2 17.7 30.7 20.4 29 22.3 C27.1 24.3 24.2 24.8 21 23.9 C17.6 23 14.4 23.9 11.6 25.9 C10.5 26.7 9.2 26.6 8.5 25.6 C7.8 24.5 6.5 21.5 6.5 18.5 Z"/>'
  + '<path fill="currentColor" d="M28.9 15.3 L36.6 8.6 L33.4 17.7 Z"/>'
  + '<path fill="currentColor" d="M18.6 10.6 C21.6 8 26.4 9.1 27.8 12.9 C26.6 11.9 24.5 11.1 22.2 11.3 C20 11.5 18.9 11.2 18.6 10.6 Z"/>'
  + '<circle fill="#ffffff" cx="10" cy="16.8" r="1.4"/>'
  + '<circle fill="currentColor" cx="10.5" cy="16.9" r="0.7"/>'
  + '<path fill="currentColor" opacity="0.55" d="M8.6 21.2 C10.6 20.4 12.6 20.2 14.2 20.8 C12.4 21.2 10.6 21.6 8.6 21.2 Z"/>'
  + '</svg>'

const CATGIRL_SVG = '<svg viewBox="0 0 40 32" focusable="false" aria-hidden="true">'
  + '<path fill="currentColor" d="M11.6 10.2 L8.4 2.4 L15.8 6.8 Z"/>'
  + '<path fill="currentColor" d="M28.4 10.2 L31.6 2.4 L24.2 6.8 Z"/>'
  + '<circle fill="currentColor" cx="20" cy="12.8" r="8.2"/>'
  + '<path fill="currentColor" d="M11.8 12.8 C11.8 7.6 15 4.8 20 4.8 C25 4.8 28.2 7.6 28.2 12.8 C27 10.8 24.4 9.4 20 9.4 C15.6 9.4 13 10.8 11.8 12.8 Z"/>'
  + '<path fill="currentColor" d="M14 20.2 C14 18.6 15.2 17.6 20 17.6 C24.8 17.6 26 18.6 26 20.2 L26 24 C26 27 24 29.2 20 29.2 C16 29.2 14 27 14 24 Z"/>'
  + '<circle fill="currentColor" cx="16.9" cy="27.6" r="1.7"/>'
  + '<circle fill="currentColor" cx="23.1" cy="27.6" r="1.7"/>'
  + '<path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M26.2 21.6 C30 20 32.8 21.2 33.4 24.4 C33.8 26.6 32.4 28.2 30.6 27.4"/>'
  + '<circle fill="#ffffff" cx="16.9" cy="13" r="1.4"/>'
  + '<circle fill="currentColor" cx="17.3" cy="13.1" r="0.7"/>'
  + '<circle fill="#ffffff" cx="23.1" cy="13" r="1.4"/>'
  + '<circle fill="currentColor" cx="22.7" cy="13.1" r="0.7"/>'
  + '<circle fill="currentColor" opacity="0.45" cx="20" cy="16.2" r="1.3"/>'
  + '</svg>'

const MERMAID_SVG = '<svg viewBox="0 0 40 32" focusable="false" aria-hidden="true">'
  + '<circle fill="currentColor" cx="20" cy="9.2" r="6.2"/>'
  + '<path fill="currentColor" d="M13.2 9 C12.7 4.4 15.4 1.8 20 1.8 C24.6 1.8 27.3 4.4 26.8 9 C25.4 5.8 23 4.6 20 4.6 C17 4.6 14.6 5.8 13.2 9 Z"/>'
  + '<path fill="currentColor" d="M13.2 9 C10.2 10.2 8.6 13.4 9.8 17.2 C11.2 14.2 13 12.4 14.8 11.6 Z"/>'
  + '<path fill="currentColor" d="M26.8 9 C29.8 10.2 31.4 13.4 30.2 17.2 C28.8 14.2 27 12.4 25.2 11.6 Z"/>'
  + '<path fill="currentColor" d="M16.2 15.2 C16.2 13.6 17.8 12.4 20 12.4 C22.2 12.4 23.8 13.6 23.8 15.2 L23.2 19 C23 21.4 21.7 22.8 20 22.8 C18.3 22.8 17 21.4 16.8 19 Z"/>'
  + '<path fill="currentColor" d="M16.3 16.8 C13.9 16.3 12.7 18 13.3 20 C13.9 19.1 14.9 18.6 16 18.6 Z"/>'
  + '<path fill="currentColor" d="M23.7 16.8 C26.1 16.3 27.3 18 26.7 20 C26.1 19.1 25.1 18.6 24 18.6 Z"/>'
  + '<path fill="currentColor" d="M16.9 22.6 C17.4 25.6 20 27.4 22.6 27 C26 26.6 27.8 28.4 27.3 31.2 C27.1 32.4 25.7 32.5 25.3 31.4 C24.9 30.2 25 28.9 23.7 28.7 C21.8 28.4 19.3 29.1 18.5 31.6 C18.1 32.8 16.7 32.7 16.5 31.5 C16.2 29.7 16.8 27.2 15.6 25.3 C15 24.1 15.8 23.2 16.9 22.6 Z"/>'
  + '<circle fill="#ffffff" cx="17.8" cy="9.4" r="1.2"/>'
  + '<circle fill="currentColor" cx="18.1" cy="9.5" r="0.6"/>'
  + '<circle fill="#ffffff" cx="22.2" cy="9.4" r="1.2"/>'
  + '<circle fill="currentColor" cx="21.9" cy="9.5" r="0.6"/>'
  + '</svg>'

/** The bundled skins, in settings-card order. */
export const SKINS: readonly DiveSkin[] = [
  {
    id: 'whale',
    nameZh: '鲸鱼娘下潜',
    nameEn: 'Whale-girl dive',
    labelZh: '深海潜行中…',
    labelEn: 'Diving deep…',
    accent: '#316ac5',
    svg: WHALE_SVG,
  },
  {
    id: 'catgirl',
    nameZh: '猫娘入水',
    nameEn: 'Cat-girl dive',
    labelZh: '喵式下潜…',
    labelEn: 'Nya dive…',
    accent: '#f28ab2',
    svg: CATGIRL_SVG,
  },
  {
    id: 'mermaid',
    nameZh: '人鱼入海',
    nameEn: 'Mermaid dive',
    labelZh: '人鱼入海…',
    labelEn: 'Mermaid dive…',
    accent: '#22b8cf',
    svg: MERMAID_SVG,
  },
]

/** Resolve a stored skin id to a concrete skin; unknown ids fall back. */
export function resolveSkin(id: string | undefined): DiveSkin {
  const skin = SKINS.find(candidate => candidate.id === id)
  return skin ?? SKINS.find(candidate => candidate.id === DEFAULT_SKIN_ID)!
}

/** Pick a concrete skin uniformly at random (the 'random' choice). */
export function randomSkin(): DiveSkin {
  const index = Math.floor(Math.random() * SKINS.length)
  return SKINS[index]!
}
