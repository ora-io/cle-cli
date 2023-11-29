// import fs from 'node:fs'
import { Error, ZkGraphYaml, verify as verifyApi } from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { loadJsonRpcProviderUrl, logDivider } from '../utils'
import type { UserConfig } from '../config'
import { AggregatorVerifierAddress } from '../constants'

export interface VerifyOptions {
  taskId: string
  yamlPath: string
  zkWasmProviderUrl: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
}
export async function verify(options: VerifyOptions) {
  logger.info('>> VERIFY PROOF ONCHAIN')
  const { yamlPath, taskId, zkWasmProviderUrl, jsonRpcProviderUrl } = options

  const zkgraphYaml = ZkGraphYaml.fromYamlPath(yamlPath)
  if (!zkgraphYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }

  const jsonRpcUrl = loadJsonRpcProviderUrl(zkgraphYaml, jsonRpcProviderUrl, false)

  // Get deployed verification contract address.
  // TODO: I reused this func to save code, but the naming is a bit misleading, fix it later.
  const verifierAddress = loadJsonRpcProviderUrl(zkgraphYaml, AggregatorVerifierAddress, false)

  const verifyResult = await verifyApi(
    taskId,
    zkWasmProviderUrl,
    verifierAddress || '',
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
