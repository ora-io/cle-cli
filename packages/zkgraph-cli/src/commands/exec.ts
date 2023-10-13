import fs from 'node:fs'
import to from 'await-to-js'
import { providers } from 'ethers'
// @ts-expect-error non-types
import { executeOnRawReceipts, getRawReceipts } from '@hyperoracle/zkgraph-api'
import { loadJsonRpcProviderUrl, parseYaml, validateProvider } from '../utils'
import type { ZkGraphYaml } from '../types'
import { logger } from '../logger'
import type { UserConfig } from '../config'

export interface ExecOptions {
  local: boolean
  blockId: number
  wasmPath: string
  yamlPath: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
}
export async function exec(options: ExecOptions) {
  const { yamlPath, jsonRpcProviderUrl, wasmPath, blockId, local } = options
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  const [yamlErr, yaml] = await to(parseYaml<Partial<ZkGraphYaml>>(yamlContent))
  if (yamlErr) {
    logger.error(`[-] LOAD YAML ERROR. ${yamlErr.message}`)
    return
  }
  if (!yaml) {
    logger.error('invalid yaml')
    return
  }
  const JsonRpcProviderUrl = loadJsonRpcProviderUrl(yaml, jsonRpcProviderUrl, true)

  const provider = new providers.JsonRpcProvider(JsonRpcProviderUrl)
  const [validateErr] = await to(validateProvider(provider))
  if (validateErr) {
    logger.error(`[-] PROVIDER VALIDATION ERROR. ${validateErr.message}`)
    return
  }

  const rawReceiptList = await getRawReceipts(provider, Number(blockId), false)

  const wasm = fs.readFileSync(wasmPath)
  const wasmUnit8Array = new Uint8Array(wasm)

  const state = await executeOnRawReceipts(
    wasmUnit8Array,
    yamlContent,
    rawReceiptList,
    local,
    true,
  )
  return state
}
