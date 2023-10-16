import fs from 'node:fs'
// @ts-expect-error non-types
import { setup as apiSetup } from '@hyperoracle/zkgraph-api'
import { logger } from 'ethers'

export interface SetupOptions {
  wasmPath: string
  circuitSize: number
  local: boolean
  userPrivateKey: string
  zkWasmProviderUrl: string
}
export async function setup(options: SetupOptions) {
  const { wasmPath, circuitSize, local, zkWasmProviderUrl, userPrivateKey } = options
  const wasm = fs.readFileSync(wasmPath)
  const wasmUnit8Array = new Uint8Array(wasm)

  logger.info('>> SET UP', '\n')

  const { md5, taskId, success } = await apiSetup(
    'poc.wasm',
    wasmUnit8Array,
    circuitSize,
    userPrivateKey,
    zkWasmProviderUrl,
    local,
    true,
  )

  return {
    md5,
    taskId,
    success,
  }
}
