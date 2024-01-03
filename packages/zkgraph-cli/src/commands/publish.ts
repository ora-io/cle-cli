import fs from 'node:fs'
import { ethers } from 'ethers'
import to from 'await-to-js'
import * as zkgapi from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { loadJsonRpcProviderUrl, logDivider } from '../utils'
import type { UserConfig } from '../../dist/index.cjs'

export interface PublishOptions {
  ipfsHash: string
  bountyRewardPerTrigger: number
  yamlPath: string
  wasmPath: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  userPrivateKey: string
  zkWasmProviderUrl: string
}

export async function publish(options: PublishOptions) {
  const { ipfsHash, jsonRpcProviderUrl, userPrivateKey, bountyRewardPerTrigger = 0, yamlPath, wasmPath, zkWasmProviderUrl } = options
  logger.info('>> PUBLISH ZKGRAPH')
  if (isNaN(bountyRewardPerTrigger)) {
    logger.warn('[-] BOUNTY REWARD IS NOT A VALID NUMBER.')
    logDivider()
  }
  const newBountyRewardPerTrigger = (Number(bountyRewardPerTrigger) || 0) * 10 ** 9

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

  const [err, publishTxHash] = await to(zkgapi.publish(
    { wasmUint8Array, zkgraphYaml },
    zkWasmProviderUrl,
    provider,
    ipfsHash,
    newBountyRewardPerTrigger,
    signer,
    true,
  ))
  if (err) {
    if (err instanceof zkgapi.Error.GraphAlreadyExist) {
      logger.error(`[-] PUBLISH FAILED. ${err.message}`)
      return publishTxHash
    }
    else {
      throw err
    }
  }

  if (publishTxHash === '')
    logger.error('[-] PUBLISH FAILED.')

  else
    logger.info(`[*] PUBLISH TX HASH: ${publishTxHash}`)

  return publishTxHash
}
