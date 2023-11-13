// import fs from 'node:fs'
// @ts-expect-error non-types
import * as zkgapi from '@hyperoracle/zkgraph-api'
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

  const publishTxHash = await zkgapi.publish(
    { wasmUint8Array: null, zkgraphYaml },
    JsonRpcProviderUrl,
    contractAddress,
    ipfsHash,
    newBountyRewardPerTrigger,
    userPrivateKey,
    true,
  )

  if (publishTxHash === '')
    logger.error('[-] PUBLISH FAILED.')

  else
    logger.info(`[*] PUBLISH TX HASH: ${publishTxHash}`)

  return publishTxHash
}
