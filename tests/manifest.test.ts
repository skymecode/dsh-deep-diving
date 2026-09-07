import { describe, expect, it } from 'vitest'
import manifest from '../package.json'
import { satisfies } from 'semver'

const SUPPORTED_VERSIONS = ['0.1.0-rc.7', '0.1.0-rc.8', '0.1.1-rc.1', '0.1.1-rc.2', '0.1.2-rc.1', '0.1.3-alpha.2']
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
})
