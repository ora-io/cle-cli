import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { exec } from '../packages/zkgraph-cli/src/commands/exec'

const commandsFixturesRoot = path.join(__dirname, 'fixtures/commands')
const jsonRpcProviderUrl = {
  mainnet: 'https://eth-mainnet.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6',
  sepolia: 'https://rpc.ankr.com/eth_sepolia',
  goerli: 'https://eth-goerli.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6',
}

describe('exec', () => {
  it('full', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'zkgraph.yaml')
    const wasmPath = path.join(commandsFixturesRoot, 'zkgraph_full.wasm')

    const res = await exec({
      yamlPath,
      local: false,
      wasmPath,
      blockId: 2279547,
      jsonRpcProviderUrl,
    })
    expect(res).not.toBeUndefined()
    expect(res).toBeInstanceOf(Uint8Array)
  }, 100000)

  it('local', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'zkgraph.yaml')
    const wasmPath = path.join(commandsFixturesRoot, 'zkgraph_local.wasm')

    const res = await exec({
      yamlPath,
      local: true,
      wasmPath,
      blockId: 2279547,
      jsonRpcProviderUrl,
    })
    expect(res).not.toBeUndefined()
    expect(res).toBeInstanceOf(Uint8Array)
  }, 100000)
})
