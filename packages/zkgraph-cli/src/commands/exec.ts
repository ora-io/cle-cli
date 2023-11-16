import fs from 'node:fs'
// import to from 'await-to-js'
// import { providers } from 'ethers'
// @ts-expect-error non-types
import * as zkgapi from '@hyperoracle/zkgraph-api'
import { /* fromHexString, */ loadJsonRpcProviderUrl, toHexString/* , validateProvider */ } from '../utils'
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
  // const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  // const yaml = await loadYaml(yamlContent)
  // if (!yaml) {
  //   logger.error('invalid yaml')
  //   return
  // }
  const zkgraphYaml = zkgapi.ZkGraphYaml.fromYamlPath(yamlPath)

  const jsonRpcUrl = loadJsonRpcProviderUrl(zkgraphYaml, jsonRpcProviderUrl, true)

  // const provider = new providers.JsonRpcProvider(JsonRpcProviderUrl)
  // const [validateErr] = await to(validateProvider(provider))
  // if (validateErr) {
  //   logger.error(`[-] PROVIDER VALIDATION ERROR. ${validateErr.message}`)
  //   return
  // }

  // const rawReceiptList = await getRawReceipts(provider, Number(blockId), false)

  const wasm = fs.readFileSync(wasmPath)
  const wasmUint8Array = new Uint8Array(wasm)

  // const state = await executeOnRawReceipts(
  //   wasmUint8Array,
  //   yamlContent,
  //   rawReceiptList,
  //   local,
  //   true,
  // )

  const dsp = zkgapi.dspHub.getDSPByYaml(zkgraphYaml, { isLocal: false })

  const execParams = dsp.toExecParams(
    jsonRpcUrl,
    blockId,
  )
  const zkgraphExecutable = {
    wasmUint8Array,
    zkgraphYaml,
  }
  const state = await zkgapi.execute(
    zkgraphExecutable,
    execParams,
    local,
    true,
  )

  logger.info(`[+] ZKGRAPH STATE OUTPUT: ${toHexString(state)}\n`)
  return state
}
