// @ts-expect-error non-types
import * as zkgapi from '@hyperoracle/zkgraph-api'
import type { UserConfig } from '../config'
import { loadJsonRpcProviderUrl } from '../utils'

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
  await zkgapi.deposit(
    jsonRpcUrl,
    deployedContractAddress,
    depositAmount,
    userPrivateKey,
    true,
  )
}
