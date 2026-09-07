import idle from '../../assets/whale-maid/idle.webp?inline'
import think from '../../assets/whale-maid/think.webp?inline'
import run from '../../assets/whale-maid/run.webp?inline'
import snow from '../../assets/whale-maid/snow.webp?inline'
import wave from '../../assets/whale-maid/wave.webp?inline'
import code from '../../assets/whale-maid/code.webp?inline'
import bubbles from '../../assets/whale-maid/bubbles.webp?inline'
import dance from '../../assets/whale-maid/dance.webp?inline'

/** Local sprite strips: 100 square frames, 10 fps, transparent on all browsers. */
export const MAID_ACTIONS = { think, run, snow, wave, code, bubbles, dance, idle } as const
export type MaidAction = keyof typeof MAID_ACTIONS
export const MAID_ACTION_IDS = Object.keys(MAID_ACTIONS) as MaidAction[]
export function resolveAction(id?: string): MaidAction {
  return MAID_ACTION_IDS.find(action => action === id) ?? 'think'
}
