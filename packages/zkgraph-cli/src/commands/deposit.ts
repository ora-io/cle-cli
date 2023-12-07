import * as zkgapi from '@hyperoracle/zkgraph-api'
import { ethers } from 'ethers'
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

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const signer = new ethers.Wallet(userPrivateKey, provider)

  const transactionHash = zkgapi.deposit(
    provider,
    signer,
    deployedContractAddress,
    depositAmount,
    true,
  )

  if (transactionHash)
    logger.info(`[*] DEPOSIT SUCCESS. TRANSACTION HASH: ${transactionHash}`)

  else
    logger.error(`[-] DEPOSIT FAILED. TRANSACTION HASH: ${transactionHash}`)
}
