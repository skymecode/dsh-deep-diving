import { describe, expect, it } from 'vitest'
import { DEFAULT_SKIN_ID, SKINS, SKIN_CHOICES, randomSkin, resolveSkin } from '../src/client/skins.ts'

describe('skin registry', () => {
  it('keeps every skin id unique and kebab-case', () => {
    expect(new Set(SKINS.map(skin => skin.id)).size).toBe(SKINS.length)
    for (const skin of SKINS) {
      expect(skin.id).toMatch(/^[a-z0-9][a-z0-9-]*$/)
    }
  })

  it('covers the settings choices with non-empty labels', () => {
    for (const id of SKIN_CHOICES) {
      if (id === 'random') continue
      const skin = resolveSkin(id)
      expect(skin.id).toBe(id)
      expect(skin.nameZh.length).toBeGreaterThan(0)
      expect(skin.nameEn.length).toBeGreaterThan(0)
      expect(skin.labelZh.length).toBeGreaterThan(0)
      expect(skin.labelEn.length).toBeGreaterThan(0)
    }
  })

  it('falls back to the default skin for unknown ids', () => {
    expect(resolveSkin('nope').id).toBe(DEFAULT_SKIN_ID)
    expect(resolveSkin(undefined).id).toBe(DEFAULT_SKIN_ID)
  })

  it('randomSkin always returns a registered skin', () => {
    const ids = new Set(SKINS.map(skin => skin.id))
    for (let i = 0; i < 50; i += 1) {
      expect(ids.has(randomSkin().id)).toBe(true)
    }
  })
})
