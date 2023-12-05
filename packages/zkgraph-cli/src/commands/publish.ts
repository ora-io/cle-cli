import fs from 'node:fs'
import { ethers } from 'ethers'
import * as zkgapi from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { loadJsonRpcProviderUrl, logDivider } from '../utils'
import type { UserConfig } from '../../dist/index.cjs'

export interface PublishOptions {
  ipfsHash: string
  bountyRewardPerTrigger: number
  yamlPath: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  zkwasmProviderUrl: string
  userPrivateKey: string
  wasmPath: string
}

export async function publish(options: PublishOptions) {
  const { ipfsHash, jsonRpcProviderUrl, zkwasmProviderUrl, userPrivateKey, bountyRewardPerTrigger, yamlPath, wasmPath } = options
  logger.info('>> PUBLISH ZKGRAPH')
  if (isNaN(bountyRewardPerTrigger)) {
    logger.warn('[-] BOUNTY REWARD IS NOT A VALID NUMBER.')
    logDivider()
  }
  const newBountyRewardPerTrigger = bountyRewardPerTrigger * 10 ** 9

  const zkgraphYaml = zkgapi.ZkGraphYaml.fromYamlPath(yamlPath)
  if (!zkgraphYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }

  const JsonRpcProviderUrl = loadJsonRpcProviderUrl(zkgraphYaml, jsonRpcProviderUrl, false)
  const provider = new ethers.providers.JsonRpcProvider(JsonRpcProviderUrl)
  const signer = new ethers.Wallet(userPrivateKey, provider)
  const wasm = fs.readFileSync(wasmPath)
  const wasmUint8Array = new Uint8Array(wasm)

  const publishTxHash = await zkgapi.publish(
    { wasmUint8Array, zkgraphYaml },
    zkwasmProviderUrl,
    provider,
    ipfsHash,
    newBountyRewardPerTrigger,
    signer,
    true,
  )

  if (publishTxHash === '')
    logger.error('[-] PUBLISH FAILED.')

  else
    logger.info(`[*] PUBLISH TX HASH: ${publishTxHash}`)

  return publishTxHash
}
