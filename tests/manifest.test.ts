import { describe, expect, it } from 'vitest'
import manifest from '../package.json'
import { satisfies } from 'semver'
import { createRequire } from 'node:module'

const CURRENT_SDK = '0.1.5-rc.2'
const SUPPORTED_VERSIONS = [
  '0.1.0-rc.7', '0.1.0-rc.8', '0.1.1-rc.1', '0.1.1-rc.2',
  '0.1.2-rc.1', '0.1.3-alpha.2', '0.1.5-alpha.1', '0.1.5-alpha.2',
  '0.1.5-rc.1', CURRENT_SDK,
]
const require = createRequire(import.meta.url)
const DSH_PEERS = [
  '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-ui-conversation',
  '@deepseek-ai/dsh-client-ui-settings',
  '@deepseek-ai/dsh-client-ui-settings-plugins',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-settings',
] as const

describe('plugin manifest compatibility', () => {
  it('loads the official settings surface and conversation UI first', () => {
    expect(manifest.dsh.client.inject).toEqual([
      '@deepseek-ai/dsh-client-ui-settings-plugins',
      '@deepseek-ai/dsh-client-ui-conversation',
    ])
  })

  it('accepts supported prereleases without installing the removed client runtime', () => {
    for (const name of DSH_PEERS) {
      for (const version of SUPPORTED_VERSIONS) expect(satisfies(version, manifest.peerDependencies[name])).toBe(true)
    }
    expect(manifest.peerDependencies).not.toHaveProperty('@deepseek-ai/dsh-client-runtime')
  })

  it('pins and actually installs the current official SDK for compatibility checks', () => {
    for (const [name, version] of Object.entries(manifest.devDependencies)) {
      if (!name.startsWith('@deepseek-ai/dsh-')) continue
      expect(version, name).toBe(CURRENT_SDK)
      expect(require(`${name}/package.json`).version, name).toBe(CURRENT_SDK)
    }
  })

  it('does not claim unreviewed future prerelease or breaking minor versions', () => {
    for (const name of DSH_PEERS) {
      expect(satisfies('0.1.6-alpha.1', manifest.peerDependencies[name]), name).toBe(false)
      expect(satisfies('0.2.0', manifest.peerDependencies[name]), name).toBe(false)
    }
  })
})
