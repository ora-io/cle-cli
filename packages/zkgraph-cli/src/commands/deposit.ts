// @ts-expect-error non-types
import * as zkgapi from '@hyperoracle/zkgraph-api'
import to from 'await-to-js'
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

  const jsonRpcUrl = loadJsonRpcProviderUrl(zkgraphYaml, jsonRpcProviderUrl, true)
  const [depositErr, transactionHash] = await to(zkgapi.deposit(
    jsonRpcUrl,
    deployedContractAddress,
    depositAmount,
    userPrivateKey,
    true,
  ))
  if (depositErr) {
    logger.error(`[-] DEPOSIT ERROR. ${depositErr.message}`)
    return
  }

  if (transactionHash)
    logger.info(`[*] DEPOSIT SUCCESS. TRANSACTION HASH: ${transactionHash}`)

  else
    logger.error(`[-] DEPOSIT FAILED. TRANSACTION HASH: ${transactionHash}`)
}
