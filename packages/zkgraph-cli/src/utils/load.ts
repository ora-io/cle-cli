import { ethers } from 'ethers'
import type { DataSource, ZkGraphYaml } from '../types'
import type { UserConfig } from '../config'
import { logger } from '../logger'
import { logDivider } from './log'
import { getTargetNetwork } from './network'
import { yamlHealthCheck } from './yaml'

export function loadZKGraphDataSources(config: Partial<ZkGraphYaml>) {
  return config.dataSources
}

export function loadZKGraphDataDestinations(config: Partial<ZkGraphYaml>) {
  return config.dataDestinations
}

/*
 * @param {string} yamlPath of zkgraph.yaml
 * @param {boolean} isDataSource, if true, return the first data source, else return the first data destination
 * @returns {object} JsonRpcProviderUrl from config.js
 */
export function loadJsonRpcProviderUrl(yaml: Partial<ZkGraphYaml>, configJsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl'], isDataSource: boolean) {
  let network: string | undefined
  // For exec and prove, we need to load the data source network
  if (isDataSource)
    network = loadZKGraphDataSources(yaml)?.[0].network

  // For publish, we need to load the data destination network
  else
    network = loadZKGraphDataDestinations(yaml)?.[0].network

  if (!network) {
    logger.warn(
      `[-] JSON RPC PROVIDER URL FOR NETWORK "${network}" IS NOT DEFINED IN YAML.`,
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

/**
 * Load ZKGraph sources
 * @param config
 * @returns
 */
export function loadZKGraphSources(config: Partial<ZkGraphYaml>) {
  yamlHealthCheck(config)
  const loadFromDataSource = (dataSource: DataSource): [string, string[]] => {
    const source_address = dataSource.source.address
    const edefs = dataSource.mapping.eventHandlers.map(
      eh => eh.event,
    )
    const source_esigs = edefs.map(ed =>
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ed)),
    )
    return [source_address, source_esigs]
  }

  const sourceAddressList: string[] = []
  const sourceEsigsList: string[][] = []
  config.dataSources?.forEach((ds) => {
    const [sa, se] = loadFromDataSource(ds)
    sourceAddressList.push(sa)
    sourceEsigsList.push(se)
  })
  return [sourceAddressList, sourceEsigsList]
}
