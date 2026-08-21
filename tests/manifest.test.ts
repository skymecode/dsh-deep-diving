import { describe, expect, it } from 'vitest'
import manifest from '../package.json'

const SUPPORTED_DSH_RANGE = '^0.1.0-rc.7 || ^0.1.1-rc.1'
const DSH_PEERS = [
  '@deepseek-ai/dsh-client-connection',
  '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-runtime',
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

  it('accepts both the legacy and current DSH release lines', () => {
    for (const name of DSH_PEERS) {
      expect(manifest.peerDependencies[name]).toBe(SUPPORTED_DSH_RANGE)
    }
  })
})
