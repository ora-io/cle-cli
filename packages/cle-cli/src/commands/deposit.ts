import * as cleApi from '@ora-io/cle-api'
import { ethers } from 'ethers'
import type { UserConfig } from '../config'
import { loadJsonRpcProviderUrl, loadYamlFromPath, logLoadingAnimation } from '../utils'
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
  const cleYaml = loadYamlFromPath(yamlPath)
  if (!cleYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }

  const jsonRpcUrl = loadJsonRpcProviderUrl(cleYaml, jsonRpcProviderUrl, true)
  if (!jsonRpcUrl) {
    logger.error('[-] ERROR: Failed to get jsonRpcUrl')
    return
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const signer = new ethers.Wallet(userPrivateKey, provider)

  logger.info('[*] Please wait for deposit tx... (estimated: 30 sec)')
  const loading = logLoadingAnimation()

  const txReceipt = await cleApi.deposit(
    deployedContractAddress,
    signer,
    { depositAmount },
  )

  loading.stopAndClear()
  if (txReceipt.transactionHash) {
    logger.info('[+] CLE BOUNTY DEPOSIT COMPLETE!')
    logger.info(
      `[*] Transaction confirmed in block ${txReceipt?.blockNumber}`,
    )
    logger.info(`[*] Transaction hash: ${txReceipt?.transactionHash}`)
  }
  else {
    logger.error(`[-] DEPOSIT FAILED. TRANSACTION HASH: ${txReceipt?.transactionHash}`)
  }
}
