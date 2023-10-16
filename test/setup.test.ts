import path from 'node:path'
import { describe, it } from 'vitest'
import { setup } from '../packages/zkgraph-cli/src/commands/setup'
const commandsFixturesRoot = path.join(__dirname, 'fixtures/commands')

describe('setup', () => {
  // TODO: This is temporary
  it.skipIf(true)('full', async () => {
    const wasmPath = path.join(commandsFixturesRoot, 'zkgraph_full.wasm')

    const res = await setup({
      local: false,
      wasmPath,
      zkWasmProviderUrl: 'https://zkwasm-explorer.delphinuslab.com:8090',
      userPrivateKey: '0x12',
      circuitSize: 22,
    })
    // eslint-disable-next-line no-console
    console.log(res)
  })
})
