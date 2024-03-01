import path from 'node:path'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { exec } from '../src/commands/exec'

const commandsFixturesRoot = path.join(__dirname, 'fixtures/commands')
const washPath = process.cwd()
const jsonRpcProviderUrl = {
  mainnet: 'https://eth-mainnet.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6',
  sepolia: 'https://rpc.ankr.com/eth_sepolia',
  goerli: 'https://eth-goerli.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6',
}

describe('exec', () => {
  it('full', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'cle.yaml')
    const wasmPath = path.join(washPath, 'temp/cle.wasm')
    if (!fs.existsSync(wasmPath)) {
      console.warn('Wasm not found. Please prioritize the execution of unit tests for compile.')
      return
    }

    const res = await exec({
      yamlPath,
      // local: false,
      wasmPath,
      params: [2279547],
      jsonRpcProviderUrl,
    })
    expect(res).not.toBeUndefined()
    expect(res).toBeInstanceOf(Uint8Array)
  }, 100000)

  // it.skip('local', async () => {
  //   const yamlPath = path.join(commandsFixturesRoot, 'cle.yaml')
  //   const wasmPath = path.join(washPath, 'temp/cle_local.wasm')
  //   if (!fs.existsSync(wasmPath)) {
  //     console.warn('Wasm not found. Please prioritize the execution of unit tests for compile.')
  //     return
  //   }

  //   const res = await exec({
  //     yamlPath,
  //     // local: true,
  //     wasmPath,
  //     params: [2279547],
  //     jsonRpcProviderUrl,
  //   })
  //   expect(res).not.toBeUndefined()
  //   expect(res).toBeInstanceOf(Uint8Array)
  // }, 100000)
})
