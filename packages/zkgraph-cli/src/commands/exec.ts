import fs from 'node:fs'
import to from 'await-to-js'
import * as zkgapi from '@hyperoracle/zkgraph-api'
import { generateDspHubParams, loadJsonRpcProviderUrl, toHexString } from '../utils'
import { logger } from '../logger'
import type { UserConfig } from '../config'

export interface ExecOptions {
  local: boolean
  wasmPath: string
  yamlPath: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  params?: any[]
}
// TODO: prepare all params, dsp select params.
export async function exec(options: ExecOptions) {
  const { yamlPath, jsonRpcProviderUrl, wasmPath, local, params = [] } = options

  const zkgraphYaml = zkgapi.ZkGraphYaml.fromYamlPath(yamlPath)
  if (!zkgraphYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }
  const dsp = zkgapi.dspHub.getDSPByYaml(zkgraphYaml, { isLocal: local })
  if (!dsp) {
    logger.error('[-] ERROR: Failed to get DSP')
    return
  }
  const [generateErr, realParams] = await to(generateDspHubParams(dsp, params, 'exec'))
  if (generateErr) {
    // eslint-disable-next-line no-console
    console.log(generateErr.message)
    return
  }
  if (realParams?.blockId)
    logger.info(`[*] Run zkgraph on block ${realParams?.blockId}`)

  const jsonRpcUrl = loadJsonRpcProviderUrl(zkgraphYaml, jsonRpcProviderUrl, true)

  const wasm = fs.readFileSync(wasmPath)
  const wasmUint8Array = new Uint8Array(wasm)

  const execParams = dsp.toExecParams(
    {
      jsonRpcUrl,
      ...realParams,
    },
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
