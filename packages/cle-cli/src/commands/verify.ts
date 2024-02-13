// import fs from 'node:fs'
import { Error, getVerifyProofParamsByTaskID, verify as verifyApi } from '@ora-io/cle-api'
import { logger } from '../logger'
import { loadJsonRpcProviderUrl, loadYamlFromPath, logDivider } from '../utils'
import type { UserConfig } from '../config'
// import { AggregatorVerifierAddress } from '../constants'

export interface VerifyOptions {
  taskId: string
  yamlPath: string
  zkWasmProviderUrl: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
}
export async function verify(options: VerifyOptions) {
  logger.info('>> VERIFY PROOF ONCHAIN')
  const { yamlPath, taskId, zkWasmProviderUrl, jsonRpcProviderUrl } = options

  const cleYaml = loadYamlFromPath(yamlPath)
  if (!cleYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }

  const jsonRpcUrl = loadJsonRpcProviderUrl(cleYaml, jsonRpcProviderUrl, false)

  // Get deployed verification contract address.
  // TODO: I reused this func to save code, but the naming is a bit misleading, fix it later.
  // const verifierAddress = loadJsonRpcProviderUrl(cleYaml, AggregatorVerifierAddress, false)
  const proofParams = await getVerifyProofParamsByTaskID(taskId, zkWasmProviderUrl)

  const verifyResult = await verifyApi(
    {
      cleYaml,
      wasmUint8Array: null,
    },
    proofParams,
    jsonRpcUrl || '',
  ).catch((error: Error) => {
    if (error instanceof Error.ProveTaskNotReady)
      logger.error(`>> PROOF IS NOT READY. ${error.message}`)
  })

  logDivider()

  if (verifyResult)
    logger.info('>> VERIFY PROOF ONCHAIN SUCCESS')

  else
    logger.error('>> VERIFY PROOF ONCHAIN FAILED')

  return verifyResult
}
