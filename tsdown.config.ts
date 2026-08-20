/**
 * Standalone tsdown config for dsh-deep-dive-skins.
 *
 * Uses the vendored client-bundle preset (build/tsdown.client.ts, copied from
 * the dsh-web-ui monorepo shared/tsdown.client.ts — Apache-2.0): the node half
 * compiles from src, the browser half is emitted as a closure-factory artifact
 * for window.__ModuleLoader__ with CSS Modules inlined and externals resolved
 * through the loader module table. Types ship from lib/types (tsc).
 */
import { clientBundle } from './build/tsdown.client.ts'

export default clientBundle(
  'dsh-deep-dive-skins',
  ['src/index.ts'],
  {
    libExternal: [
      '@deepseek-ai/dsh-settings',
    ],
  },
)
