import fs from 'node:fs'
import to from 'await-to-js'
import * as zkgapi from '@hyperoracle/cle-api'
import ethres from 'ethers'
import { generateDspHubParams, loadJsonRpcProviderUrl, loadYamlFromPath, toHexString } from '../utils'
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

  const cleYaml = loadYamlFromPath(yamlPath)
  if (!cleYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }
  const dsp = zkgapi.dspHub.getDSPByYaml(cleYaml, { isLocal: local })
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
    logger.info(`[*] Run cle on block ${realParams?.blockId}`)

  const jsonRpcUrl = loadJsonRpcProviderUrl(cleYaml, jsonRpcProviderUrl, true)
  const provider = new ethres.providers.JsonRpcProvider(jsonRpcUrl)

  const wasm = fs.readFileSync(wasmPath)
  const wasmUint8Array = new Uint8Array(wasm)

  const execParams = dsp.toExecParams(
    {
      provider,
      ...realParams,
    },
  )
  const cleExecutable = {
    wasmUint8Array,
    cleYaml,
  }

  const state = await zkgapi.execute(
    cleExecutable,
    execParams,
    local,
  )

  logger.info(`[+] CLE STATE OUTPUT: ${toHexString(state)}\n`)
  return state
}
