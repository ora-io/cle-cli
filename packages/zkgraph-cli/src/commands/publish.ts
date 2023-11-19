import { ethers } from 'ethers'
// import fs from 'node:fs'
// @ts-expect-error non-types
import * as zkgapi from '@hyperoracle/zkgraph-api'
import to from 'await-to-js'
import { logger } from '../logger'
import { loadJsonRpcProviderUrl, logDivider } from '../utils'
import type { UserConfig } from '../../dist/index.cjs'

export interface PublishOptions {
  contractAddress: string
  ipfsHash: string
  bountyRewardPerTrigger: number
  yamlPath: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  userPrivateKey: string
}

export async function publish(options: PublishOptions) {
  const { contractAddress, ipfsHash, jsonRpcProviderUrl, userPrivateKey, bountyRewardPerTrigger, yamlPath } = options
  logger.info('>> PUBLISH ZKGRAPH')
  if (isNaN(bountyRewardPerTrigger)) {
    logger.warn('[-] BOUNTY REWARD IS NOT A VALID NUMBER.')
    logDivider()
  }
  const newBountyRewardPerTrigger = bountyRewardPerTrigger * 10 ** 9

  // const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  // const yaml = await loadYaml(yamlContent)
  // if (!yaml) {
  //   logger.error('invalid yaml')
  //   return
  // }

  const zkgraphYaml = zkgapi.ZkGraphYaml.fromYamlPath(yamlPath)

  const JsonRpcProviderUrl = loadJsonRpcProviderUrl(zkgraphYaml, jsonRpcProviderUrl, false)
  const provider = new ethers.providers.JsonRpcProvider(JsonRpcProviderUrl)
  const signer = new ethers.Wallet(userPrivateKey, provider)

  const [publishErr, publishTxHash] = await to(zkgapi.publish(
    { wasmUint8Array: null, zkgraphYaml },
    provider,
    contractAddress,
    ipfsHash,
    newBountyRewardPerTrigger,
    signer,
    true,
  ))
  if (publishErr) {
    logger.error(`[-] PUBLISH ERROR. ${publishErr.message}`)
    return
  }

  if (publishTxHash === '')
    logger.error('[-] PUBLISH FAILED.')

  else
    logger.info(`[*] PUBLISH TX HASH: ${publishTxHash}`)

  return publishTxHash
}
