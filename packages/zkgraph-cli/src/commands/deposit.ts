import * as zkgapi from '@hyperoracle/zkgraph-api'
import type { UserConfig } from '../config'
import { loadJsonRpcProviderUrl } from '../utils'
import { logger } from '../logger'

export interface DepositOptions {
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  deployedContractAddress: string
  depositAmount: string
  userPrivateKey: string
  yamlPath: string
}

export async function deposit(options: DepositOptions) {
  const { jsonRpcProviderUrl, deployedContractAddress, depositAmount, userPrivateKey, yamlPath } = options
  const zkgraphYaml = zkgapi.ZkGraphYaml.fromYamlPath(yamlPath)
  if (!zkgraphYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }

  const jsonRpcUrl = loadJsonRpcProviderUrl(zkgraphYaml, jsonRpcProviderUrl, true)
  if (!jsonRpcUrl) {
    logger.error('[-] ERROR: Failed to get jsonRpcUrl')
    return
  }
  const transactionHash = zkgapi.deposit(
    jsonRpcUrl,
    deployedContractAddress,
    depositAmount,
    userPrivateKey,
    true,
  )

  if (transactionHash)
    logger.info(`[*] DEPOSIT SUCCESS. TRANSACTION HASH: ${transactionHash}`)

  else
    logger.error(`[-] DEPOSIT FAILED. TRANSACTION HASH: ${transactionHash}`)
}
