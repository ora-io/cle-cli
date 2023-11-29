import type { ZkGraphYaml } from '@hyperoracle/zkgraph-api'
import type { UserConfig } from '../config'
import { logger } from '../logger'
import { logDivider } from './log'
import { getTargetNetwork } from './network'

/*
 * @param {string} yamlPath of zkgraph.yaml
 * @param {boolean} isDataSource, if true, return the first data source, else return the first data destination
 * @returns {object} JsonRpcProviderUrl from config.js
 */
export function loadJsonRpcProviderUrl(yaml: Partial<ZkGraphYaml>, configJsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl'], isDataSource: boolean) {
  let network: string | undefined
  // For exec and prove, we need to load the data source network
  if (isDataSource)
    network = yaml.dataSources?.[0].network

  // For publish & verify, we need to load the data destination network
  else
    network = yaml.dataDestinations?.[0].network

  if (!network) {
    logger.warn(
      `[-] NETWORK OF "${isDataSource ? 'DATASOURCE' : 'DATADESTINATION'}" IS NOT DEFINED IN YAML.`,
    )
    return undefined
  }

  // Check if the network is defined in config.js with "JsonRpcProviderUrl" + network.name (eg. "Goerli")
  const targetNetwork = getTargetNetwork(network)?.name.toLowerCase()
  let JsonRpcProviderUrl = ''
  if (targetNetwork) {
    JsonRpcProviderUrl
      = configJsonRpcProviderUrl ? (configJsonRpcProviderUrl as any)[targetNetwork] : undefined
  }

  if (!JsonRpcProviderUrl) {
    logger.warn(
      `[-] JSON RPC PROVIDER URL FOR NETWORK "${network}" IS NOT DEFINED IN CONFIG.JS.`,
    )
    logDivider()
    return undefined
  }

  return JsonRpcProviderUrl
}
