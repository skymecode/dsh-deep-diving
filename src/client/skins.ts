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
export const SKIN_CHOICES = ['whale', 'dafeiyu', 'catgirl', 'mermaid', 'random'] as const

/** Fallback skin when a stored id is unknown or missing. */
export const DEFAULT_SKIN_ID = 'whale'

const WHALE_SVG = '<svg viewBox="0 0 40 32" focusable="false" aria-hidden="true">'
  // Anime whale-girl chibi bust: white frilly maid headdress/bonnet, blue anime hair with side twintails,
  // cute anime eyes with highlights, whale ear-fin, dress collar and ribbon.
  + '<defs>'
  + '<linearGradient id="dds-wg-hair" x1="0" y1="0" x2="0" y2="1">'
  + '<stop offset="0%" stop-color="#4a7fe8"/>'
  + '<stop offset="100%" stop-color="#2a52be"/>'
  + '</linearGradient>'
  + '</defs>'
  // Maid headdress / frill
  + '<path fill="#ffffff" opacity="0.95" d="M12 7 C12 2.5 28 2.5 28 7 C29.5 7.5 30.5 9 30 11 C29 10 27.5 9.5 26 9.5 C25 5.5 15 5.5 14 9.5 C12.5 9.5 11 10 10 11 C9.5 9 10.5 7.5 12 7 Z"/>'
  // Hair back / twin sides
  + '<path fill="url(#dds-wg-hair)" d="M10 12 C7 14 5 19 6 24 C7 26 9 27 10.5 24 C10 20 11 16 13 14 Z"/>'
  + '<path fill="url(#dds-wg-hair)" d="M30 12 C33 14 35 19 34 24 C33 26 31 27 29.5 24 C30 20 29 16 27 14 Z"/>'
  // Whale ear-fins with white trim
  + '<path fill="#2a52be" d="M8.5 14.5 C5.5 14.5 4 16.5 4.5 18 C5.5 19 7.5 18.5 9.5 17 Z"/>'
  + '<path fill="#ffffff" opacity="0.8" d="M5 18 C5.8 18.8 7.2 18.5 8.5 17.5 C7 18.2 5.8 18.4 5 18 Z"/>'
  + '<path fill="#2a52be" d="M31.5 14.5 C34.5 14.5 36 16.5 35.5 18 C34.5 19 32.5 18.5 30.5 17 Z"/>'
  + '<path fill="#ffffff" opacity="0.8" d="M35 18 C34.2 18.8 32.8 18.5 31.5 17.5 C33 18.2 34.2 18.4 35 18 Z"/>'
  // Hair bows on ears
  + '<path fill="#5c8df6" d="M8 14.5 L9.5 13.5 L9.5 15.5 Z M9.5 14.5 L11 13.5 L11 15.5 Z"/>'
  + '<path fill="#5c8df6" d="M32 14.5 L30.5 13.5 L30.5 15.5 Z M30.5 14.5 L29 13.5 L29 15.5 Z"/>'
  // Face
  + '<path fill="#fff2eb" d="M13 13 C13 8.5 27 8.5 27 13 C27 18 24.5 21 20 21 C15.5 21 13 18 13 13 Z"/>'
  // Bangs / Front hair
  + '<path fill="url(#dds-wg-hair)" d="M12.5 11 C14 8 26 8 27.5 11 C26.5 13.5 25 14.5 24 13 C22.5 15.5 20.5 15.5 19.5 13 C18.5 15.5 16.5 15.5 15.5 13 C14.5 14.8 13.2 13.8 12.5 11 Z"/>'
  // Anime Eyes
  // Left eye
  + '<ellipse fill="#1b3a82" cx="16.5" cy="15.2" rx="1.8" ry="2.2"/>'
  + '<ellipse fill="#3875e8" cx="16.5" cy="15.8" rx="1.4" ry="1.4"/>'
  + '<circle fill="#ffffff" cx="15.8" cy="14.3" r="0.75"/>'
  + '<circle fill="#ffffff" cx="17.2" cy="16.3" r="0.4"/>'
  + '<path fill="none" stroke="#1b3a82" stroke-width="0.7" stroke-linecap="round" d="M14.6 13.4 Q16.5 12.8 18.4 13.6"/>'
  // Right eye
  + '<ellipse fill="#1b3a82" cx="23.5" cy="15.2" rx="1.8" ry="2.2"/>'
  + '<ellipse fill="#3875e8" cx="23.5" cy="15.8" rx="1.4" ry="1.4"/>'
  + '<circle fill="#ffffff" cx="22.8" cy="14.3" r="0.75"/>'
  + '<circle fill="#ffffff" cx="24.2" cy="16.3" r="0.4"/>'
  + '<path fill="none" stroke="#1b3a82" stroke-width="0.7" stroke-linecap="round" d="M21.6 13.6 Q23.5 12.8 25.4 13.4"/>'
  // Cute Blush
  + '<ellipse fill="#ff8fa8" opacity="0.65" cx="14.5" cy="17.5" rx="1.3" ry="0.65"/>'
  + '<ellipse fill="#ff8fa8" opacity="0.65" cx="25.5" cy="17.5" rx="1.3" ry="0.65"/>'
  // Tiny Mouth
  + '<path fill="none" stroke="#ba4862" stroke-width="0.6" stroke-linecap="round" d="M19.3 18.2 Q20 18.8 20.7 18.2"/>'
  // Maid dress / collar / tiny whale apron silhouette
  + '<path fill="#1a2754" d="M15 21 C13 22 11 25 10 29 L30 29 C29 25 27 22 25 21 Z"/>'
  + '<path fill="#ffffff" d="M16 21 L20 23.5 L24 21 L23 29 L17 29 Z"/>'
  + '<path fill="#3875e8" d="M18.8 24.8 C18.2 24.8 17.8 25.4 18.2 26 C18.8 26.8 21.2 26.8 21.8 26 C22.2 25.4 21.8 24.8 21.2 24.8 C20.6 24.8 20.4 25.2 20 25.2 C19.6 25.2 19.4 24.8 18.8 24.8 Z"/>'
  + '<circle fill="#3875e8" cx="21.5" cy="24.4" r="0.35"/>'
  + '<path fill="#5c8df6" d="M19 21.5 L21 21.5 L20 22.8 Z"/>'
  + '</svg>'

const DAFEIYU_SVG = '<svg viewBox="0 0 40 32" focusable="false" aria-hidden="true">'
  // Chubby blue anime "big fat fish" (dafeiyu / whale-girl chibi style):
  // Round plump body, cute anime whale fins, sparkling eyes, white tummy, blush and tiny splash.
  + '<defs>'
  + '<linearGradient id="dds-dfy-grad" x1="0" y1="0" x2="0" y2="1">'
  + '<stop offset="0%" stop-color="#5688f5"/>'
  + '<stop offset="100%" stop-color="#2d58ca"/>'
  + '</linearGradient>'
  + '</defs>'
  // Spout / sparkle
  + '<path fill="#70b5ff" opacity="0.8" d="M20 1.5 C20 3.5 19 4.5 18 5 C20 4.8 21 5.5 21 6.5 C21.5 5 23 4.8 24 5 C22.5 4.2 22 3 22 1.5 C21 2.8 20.8 2.8 20 1.5 Z"/>'
  + '<path fill="#ffd34d" d="M11 3 L11.7 4.8 L13.5 5.5 L11.7 6.2 L11 8 L10.3 6.2 L8.5 5.5 L10.3 4.8 Z"/>'
  // Tail fin
  + '<path fill="url(#dds-dfy-grad)" d="M31 16 C33.5 13 37.5 11.5 38.5 13 C37 15 35 16 35 17 C35 18 37 19 38.5 21 C37.5 22.5 33.5 21 31 18 Z"/>'
  // Main chubby whale body
  + '<path fill="url(#dds-dfy-grad)" d="M7 16 C7 9 13.5 5 20.5 5 C28 5 33 9.5 33 16.5 C33 23.5 27.5 27.5 20.5 27.5 C13.5 27.5 7 23.5 7 16 Z"/>'
  // White belly
  + '<path fill="#ffffff" d="M11.5 20 C12.5 24 16 26.5 20.5 26.5 C25 26.5 28.5 24 29.5 20 C27.5 22.8 24.5 24.2 20.5 24.2 C16.5 24.2 13.5 22.8 11.5 20 Z"/>'
  // Side flipper / fin
  + '<path fill="#2449b0" d="M17 19.5 C15 20.5 12 21 11.5 19.5 C11.2 18.5 13.5 17.5 16 17.8 Z"/>'
  // Top fin
  + '<path fill="#2449b0" d="M26 6 C27.5 4 29.5 4.5 29 6.8 C28.2 6.2 27 6 26 6 Z"/>'
  // Left Anime Eye
  + '<ellipse fill="#1b2e63" cx="15" cy="13.2" rx="2.1" ry="2.5"/>'
  + '<ellipse fill="#3d72e6" cx="15" cy="13.9" rx="1.6" ry="1.6"/>'
  + '<circle fill="#ffffff" cx="14.2" cy="12.2" r="0.85"/>'
  + '<circle fill="#ffffff" cx="15.8" cy="14.4" r="0.45"/>'
  + '<path fill="none" stroke="#1b2e63" stroke-width="0.7" stroke-linecap="round" d="M13 11.2 Q15 10.4 17 11.4"/>'
  // Right Anime Eye
  + '<ellipse fill="#1b2e63" cx="23" cy="13.2" rx="2.1" ry="2.5"/>'
  + '<ellipse fill="#3d72e6" cx="23" cy="13.9" rx="1.6" ry="1.6"/>'
  + '<circle fill="#ffffff" cx="22.2" cy="12.2" r="0.85"/>'
  + '<circle fill="#ffffff" cx="23.8" cy="14.4" r="0.45"/>'
  + '<path fill="none" stroke="#1b2e63" stroke-width="0.7" stroke-linecap="round" d="M21 11.4 Q23 10.4 25 11.2"/>'
  // Cheerful Blush
  + '<ellipse fill="#ff8aa2" opacity="0.85" cx="12" cy="16.5" rx="1.6" ry="0.9"/>'
  + '<ellipse fill="#ff8aa2" opacity="0.85" cx="26" cy="16.5" rx="1.6" ry="0.9"/>'
  // Cute Smile
  + '<path fill="none" stroke="#1b2e63" stroke-width="0.9" stroke-linecap="round" d="M17.5 16.5 Q19 17.8 20.5 16.5"/>'
  + '</svg>'

const CATGIRL_SVG = '<svg viewBox="0 0 40 32" focusable="false" aria-hidden="true">'
  // Anime cat-girl chibi: pink cat ears with white fluff, sakura pink hair, sparkling anime eyes, cute cat mouth and blush.
  + '<defs>'
  + '<linearGradient id="dds-cg-hair" x1="0" y1="0" x2="0" y2="1">'
  + '<stop offset="0%" stop-color="#ffaec9"/>'
  + '<stop offset="100%" stop-color="#f2789f"/>'
  + '</linearGradient>'
  + '</defs>'
  // Cat ears outer
  + '<path fill="#f2789f" d="M10 13 L8 3 L17 8 Z"/>'
  + '<path fill="#f2789f" d="M30 13 L32 3 L23 8 Z"/>'
  // Cat ears inner (white fluff + pink inner)
  + '<path fill="#ffffff" d="M10.5 11.5 L9.5 5.5 L15 8.5 Z"/>'
  + '<path fill="#ffb8cc" d="M10.8 10.5 L10.2 6.5 L14 8.5 Z"/>'
  + '<path fill="#ffffff" d="M29.5 11.5 L30.5 5.5 L25 8.5 Z"/>'
  + '<path fill="#ffb8cc" d="M29.2 10.5 L29.8 6.5 L26 8.5 Z"/>'
  // Hair back / side locks
  + '<path fill="url(#dds-cg-hair)" d="M10 12 C7 14 6 19 7 24 C8 26 9.5 26.5 10.5 24 C10.2 20 11 16 13 14 Z"/>'
  + '<path fill="url(#dds-cg-hair)" d="M30 12 C33 14 34 19 33 24 C32 26 30.5 26.5 29.5 24 C29.8 20 29 16 27 14 Z"/>'
  // Face
  + '<path fill="#fff3ec" d="M13 13 C13 8.5 27 8.5 27 13 C27 18 24.5 21 20 21 C15.5 21 13 18 13 13 Z"/>'
  // Front hair / Bangs
  + '<path fill="url(#dds-cg-hair)" d="M12.5 11 C14 8 26 8 27.5 11 C26.5 13.5 25 14.2 23.8 12.8 C22.5 15.2 20.5 15.2 19.5 12.8 C18.5 15.2 16.5 15.2 15.5 12.8 C14.5 14.5 13.2 13.5 12.5 11 Z"/>'
  // Left eye (Anime Cat Eye)
  + '<ellipse fill="#a31d4e" cx="16.5" cy="15.2" rx="1.8" ry="2.2"/>'
  + '<ellipse fill="#f25588" cx="16.5" cy="15.8" rx="1.4" ry="1.4"/>'
  + '<circle fill="#ffffff" cx="15.8" cy="14.3" r="0.75"/>'
  + '<circle fill="#ffffff" cx="17.2" cy="16.3" r="0.4"/>'
  + '<path fill="none" stroke="#a31d4e" stroke-width="0.7" stroke-linecap="round" d="M14.6 13.4 Q16.5 12.8 18.4 13.6"/>'
  // Right eye (Anime Cat Eye)
  + '<ellipse fill="#a31d4e" cx="23.5" cy="15.2" rx="1.8" ry="2.2"/>'
  + '<ellipse fill="#f25588" cx="23.5" cy="15.8" rx="1.4" ry="1.4"/>'
  + '<circle fill="#ffffff" cx="22.8" cy="14.3" r="0.75"/>'
  + '<circle fill="#ffffff" cx="24.2" cy="16.3" r="0.4"/>'
  + '<path fill="none" stroke="#a31d4e" stroke-width="0.7" stroke-linecap="round" d="M21.6 13.6 Q23.5 12.8 25.4 13.4"/>'
  // Blush
  + '<ellipse fill="#ff6b8b" opacity="0.65" cx="14.5" cy="17.5" rx="1.3" ry="0.65"/>'
  + '<ellipse fill="#ff6b8b" opacity="0.65" cx="25.5" cy="17.5" rx="1.3" ry="0.65"/>'
  // :3 Cat Mouth
  + '<path fill="none" stroke="#992244" stroke-width="0.6" stroke-linecap="round" d="M18.8 18 Q19.4 18.8 20 18.3 Q20.6 18.8 21.2 18"/>'
  // Collar with bell & dress
  + '<path fill="#f78da7" d="M15 21 C13 22 11 25 10 29 L30 29 C29 25 27 22 25 21 Z"/>'
  + '<path fill="#ffffff" d="M16 21 L20 23.5 L24 21 L23 29 L17 29 Z"/>'
  + '<path fill="#a31d4e" d="M15 21.5 L25 21.5 L24.5 22.5 L15.5 22.5 Z"/>'
  + '<circle fill="#ffd34d" cx="20" cy="23.5" r="1.1"/>'
  + '<circle fill="#b8860b" cx="20" cy="23.8" r="0.3"/>'
  // Cat tail curled up
  + '<path fill="none" stroke="#f2789f" stroke-width="2.2" stroke-linecap="round" d="M28 26 C32 24 35 25 35 22 C35 19 32 19 32 20.5"/>'
  + '</svg>'

const MERMAID_SVG = '<svg viewBox="0 0 40 32" focusable="false" aria-hidden="true">'
  // Anime mermaid chibi: ocean cyan flowing hair with pearl/shell hairpiece, sparkling eyes, fin ears, fish tail.
  + '<defs>'
  + '<linearGradient id="dds-mm-hair" x1="0" y1="0" x2="0" y2="1">'
  + '<stop offset="0%" stop-color="#38d9a9"/>'
  + '<stop offset="100%" stop-color="#12b886"/>'
  + '</linearGradient>'
  + '<linearGradient id="dds-mm-tail" x1="0" y1="0" x2="0" y2="1">'
  + '<stop offset="0%" stop-color="#20c997"/>'
  + '<stop offset="100%" stop-color="#099268"/>'
  + '</linearGradient>'
  + '</defs>'
  // Shell hair accessory
  + '<path fill="#ffe3e3" stroke="#ffa8a8" stroke-width="0.4" d="M12 6 C10 4 13 2 15 4 C15.5 2.5 17.5 3.5 16.5 5.5 Z"/>'
  + '<circle fill="#ffffff" cx="15.5" cy="5.5" r="0.7"/>'
  // Hair back / flowing waves
  + '<path fill="url(#dds-mm-hair)" d="M10 12 C6 15 5 22 7 27 C8.5 27 10 25 9.5 22 C9 18 10.5 15 13 14 Z"/>'
  + '<path fill="url(#dds-mm-hair)" d="M30 12 C34 15 35 22 33 27 C31.5 27 30 25 30.5 22 C31 18 29.5 15 27 14 Z"/>'
  // Fin ears
  + '<path fill="#38d9a9" opacity="0.8" d="M8.5 14 C5.5 13.5 4.5 16 6 17.5 C7.5 17 8.5 15.5 9 14.5 Z"/>'
  + '<path fill="#38d9a9" opacity="0.8" d="M31.5 14 C34.5 13.5 35.5 16 34 17.5 C32.5 17 31.5 15.5 31 14.5 Z"/>'
  // Face
  + '<path fill="#fff4ed" d="M13 13 C13 8.5 27 8.5 27 13 C27 18 24.5 21 20 21 C15.5 21 13 18 13 13 Z"/>'
  // Front hair / Bangs
  + '<path fill="url(#dds-mm-hair)" d="M12.5 11 C14 8 26 8 27.5 11 C26.5 13.5 25 14.2 23.8 12.8 C22.5 15.2 20.5 15.2 19.5 12.8 C18.5 15.2 16.5 15.2 15.5 12.8 C14.5 14.5 13.2 13.5 12.5 11 Z"/>'
  // Left eye
  + '<ellipse fill="#085f63" cx="16.5" cy="15.2" rx="1.8" ry="2.2"/>'
  + '<ellipse fill="#20c997" cx="16.5" cy="15.8" rx="1.4" ry="1.4"/>'
  + '<circle fill="#ffffff" cx="15.8" cy="14.3" r="0.75"/>'
  + '<circle fill="#ffffff" cx="17.2" cy="16.3" r="0.4"/>'
  + '<path fill="none" stroke="#085f63" stroke-width="0.7" stroke-linecap="round" d="M14.6 13.4 Q16.5 12.8 18.4 13.6"/>'
  // Right eye
  + '<ellipse fill="#085f63" cx="23.5" cy="15.2" rx="1.8" ry="2.2"/>'
  + '<ellipse fill="#20c997" cx="23.5" cy="15.8" rx="1.4" ry="1.4"/>'
  + '<circle fill="#ffffff" cx="22.8" cy="14.3" r="0.75"/>'
  + '<circle fill="#ffffff" cx="24.2" cy="16.3" r="0.4"/>'
  + '<path fill="none" stroke="#085f63" stroke-width="0.7" stroke-linecap="round" d="M21.6 13.6 Q23.5 12.8 25.4 13.4"/>'
  // Blush
  + '<ellipse fill="#ff8aa2" opacity="0.65" cx="14.5" cy="17.5" rx="1.3" ry="0.65"/>'
  + '<ellipse fill="#ff8aa2" opacity="0.65" cx="25.5" cy="17.5" rx="1.3" ry="0.65"/>'
  // Smile
  + '<path fill="none" stroke="#0b7285" stroke-width="0.6" stroke-linecap="round" d="M19.3 18.2 Q20 18.8 20.7 18.2"/>'
  // Shell top & mermaid tail
  + '<path fill="#fcc2d7" d="M16 22 C17 21 18.5 22 18.5 23 C18.5 24 16.5 24.5 16 23 Z"/>'
  + '<path fill="#fcc2d7" d="M24 22 C23 21 21.5 22 21.5 23 C21.5 24 23.5 24.5 24 23 Z"/>'
  + '<path fill="url(#dds-mm-tail)" d="M17 24 C17 24 16 27 18 29 C20 31 23 28 25 29 C27 30 29 27.5 27 26.5 C25 25.5 23 24 23 24 Z"/>'
  // Tail fluke
  + '<path fill="#63e6be" opacity="0.9" d="M25 29 C27 31.5 30 31.5 31 30 C30 28.5 27.5 28 25.5 28.5 Z"/>'
  + '<path fill="#63e6be" opacity="0.9" d="M25 29 C25.5 31.8 24 33 22.5 32 C23 30 24 28.8 25 29 Z"/>'
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
    id: 'dafeiyu',
    nameZh: '大肥鱼',
    nameEn: 'Big fat fish',
    labelZh: '大肥鱼下潜…',
    labelEn: 'Big fish dive…',
    accent: '#5060a8',
    svg: DAFEIYU_SVG,
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
