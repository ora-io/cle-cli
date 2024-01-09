import path from 'node:path'
import fs from 'node:fs'
import { describe, it } from 'vitest'
import { prove } from '../packages/cle-cli/src/commands/prove'

const commandsFixturesRoot = path.join(__dirname, 'fixtures/commands')
const washPath = process.cwd()

const jsonRpcProviderUrl = {
  mainnet: 'https://eth-mainnet.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6',
  sepolia: 'https://rpc.ankr.com/eth_sepolia',
  goerli: 'https://eth-goerli.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6',
}

const zkWasmProviderUrl = 'https://zkwasm-explorer.delphinuslab.com:8090'
const userPrivateKey = '0x0'
const outputProofFilePath = path.join(commandsFixturesRoot, 'proof.txt')
const blockId = 2279547
const expectedStateStr = 'a60ecf32309539dd84f27a9563754dca818b815e'

describe('prove', () => {
  it('full inputgen mode', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'cle.yaml')
    const wasmPath = path.join(washPath, 'temp/cle_full.wasm')
    if (!fs.existsSync(wasmPath)) {
      console.warn('Wasm not found. Please prioritize the execution of unit tests for compile.')
      return
    }

    await prove({
      inputgen: true,
      test: false,
      prove: false,
      params: [blockId, expectedStateStr],
      local: false,
      wasmPath,
      yamlPath,
      jsonRpcProviderUrl,
      zkWasmProviderUrl,
      userPrivateKey,
      outputProofFilePath,
    })
  }, 100000)

  it.skip('local inputgen mode', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'cle.yaml')
    const wasmPath = path.join(washPath, 'temp/cle_local.wasm')
    if (!fs.existsSync(wasmPath)) {
      console.warn('Wasm not found. Please prioritize the execution of unit tests for compile.')
      return
    }

    await prove({
      inputgen: true,
      test: false,
      prove: false,
      params: [blockId, expectedStateStr],
      local: true,
      wasmPath,
      yamlPath,
      jsonRpcProviderUrl,
      zkWasmProviderUrl,
      userPrivateKey,
      outputProofFilePath,
    })
  }, 100000)

  it.skip('local test mode', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'cle.yaml')
    const wasmPath = path.join(washPath, 'temp/cle_local.wasm')
    if (!fs.existsSync(wasmPath)) {
      console.warn('Wasm not found. Please prioritize the execution of unit tests for compile.')
      return
    }

    await prove({
      inputgen: false,
      test: true,
      prove: false,
      params: [blockId.toString(), expectedStateStr],
      local: true,
      wasmPath,
      yamlPath,
      jsonRpcProviderUrl,
      zkWasmProviderUrl,
      userPrivateKey,
      outputProofFilePath,
    })
  }, 100000)
})
