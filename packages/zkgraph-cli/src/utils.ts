import path from 'node:path'
import fs from 'node:fs'
import yaml from 'js-yaml'
import semver from 'semver'
import { ethers } from 'ethers'
import type { DataSource, ZkGraphYaml } from './types'

/**
 * Parse yaml
 * @param content
 * @returns
 */
export async function parseYaml<T = any>(content: string) {
  return new Promise<T>((resolve, reject) => {
    try {
      resolve(yaml.load(content) as T)
    }
    catch (e) {
      reject(e)
    }
  })
}

/**
 * Check if the yaml is valid
 * @param config
 */
export function yamlHealthCheck(config: Partial<ZkGraphYaml> = {}) {
  // 1. specVersion check

  if (!config.specVersion || typeof config.specVersion !== 'string' || config.specVersion.trim() === '')
    throw new Error('specVersion is missing or empty')

  if (semver.gt(config.specVersion, '0.0.1'))
    throw new Error('Invalid specVersion, it should be <= 0.0.1')

  // 3. datasources can have multiple objects, but should not be empty
  if (!config.dataSources || config.dataSources.length === 0)
    throw new Error('dataSources should not be empty')

  const sourceNetworks: string[] = []

  config.dataSources.forEach((dataSource) => {
    // 4. every object in datasources MUST have network, source, mapping
    if (!dataSource.network || !dataSource.source || !dataSource.mapping)
      throw new Error('dataSource object is missing required fields')

    sourceNetworks.push(dataSource.network)

    // 5. all fields must be not empty
    if (!dataSource.kind || !dataSource.source.address || !dataSource.mapping.kind
      || !dataSource.mapping.apiVersion || !dataSource.mapping.language || !dataSource.mapping.file)
      throw new Error('Some required fields are empty in dataSource')

    // 2. apiVersion → zkgraph-lib version check
    if (!dataSource.mapping.apiVersion || typeof dataSource.mapping.apiVersion !== 'string' || dataSource.mapping.apiVersion.trim() === '')
      throw new Error('apiVersion is missing or empty in one of the dataSources')

    if (semver.gt(dataSource.mapping.apiVersion, '0.0.1'))
      throw new Error('Invalid apiVersion, it should be <= 0.0.1')

    // 7. source must contain address
    if (!dataSource.source.address)
      throw new Error('Address field is missing in dataSource source')

    // 8. eventHandlers can have multiple event objects, but should not be empty
    if (!dataSource.mapping.eventHandlers || dataSource.mapping.eventHandlers.length === 0)
      throw new Error('eventHandlers should not be empty')

    dataSource.mapping.eventHandlers.forEach((eventHandler) => {
      // 9. each event object must have event field and handler field
      if (!eventHandler.event || !eventHandler.handler)
        throw new Error('eventHandler object is missing required fields')

      // 10. handler doesn't need to be checked, not empty is enough
      if (!eventHandler.handler)
        throw new Error('Handler field in eventHandler is empty')
    })
  })

  // 6. every network field must be the same
  if (new Set(sourceNetworks).size !== 1)
    throw new Error('All dataSource networks must be the same')

  // 11. data destination must have network and destination
  if (config.dataDestinations) {
    if (!config.dataDestinations[0].network || !config.dataDestinations[0].destination)
      throw new Error('dataDestinations object is missing required fields')

    // 13. address must be the ethereum address and not address zero
    if (!isEthereumAddress(config.dataDestinations[0].destination.address))
      throw new Error('Invalid Ethereum address in dataDestinations')
  }

  // 12. the network must be same as the source network
  // TODO: right now we don't check the block hash, so skip the same network check
  // if (config.dataDestinations[0].network !== sourceNetworks[0]) {
  //   throw new Error("dataDestinations network must match dataSources network");
  // }
}

/**
 * Check if the address is ethereum address
 * @param address
 * @returns
 */
export function isEthereumAddress(address: string) {
  try {
    const parsedAddress = ethers.getAddress(address)
    return parsedAddress !== '0x0000000000000000000000000000000000000000'
  }
  catch (error) {
    return false
  }
}

/**
 * Load ZKGraph sources
 * @param config
 * @returns
 */
export function loadZKGraphSources(config: Partial<ZkGraphYaml>) {
  const loadFromDataSource = (dataSource: DataSource): [string, string[]] => {
    const source_address = dataSource.source.address
    const edefs = dataSource.mapping.eventHandlers.map(
      eh => eh.event,
    )
    const source_esigs = edefs.map(ed =>
      ethers.keccak256(ethers.toUtf8Bytes(ed)),
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

/**
 * Convert hex string to Uint8Array
 * @param hexString
 * @returns
 */
export function fromHexString(hexString: string) {
  hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString
  hexString = hexString.length % 2 ? `0${hexString}` : hexString
  return Uint8Array.from(Buffer.from(hexString, 'hex'))
}

/**
 * Generate a random key
 * @param length
 * @returns
 */
export const randomUniqueKey = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const maxPos = chars.length
  let key = ''
  for (let i = 0; i < length; i++)
    key += chars.charAt(Math.floor(Math.random() * maxPos))

  return key
}

export const getRelativePath = (a: string, b: string) => {
  const relativePath1 = path.relative(path.dirname(a), b)
  const relativePath2 = path.relative(path.dirname(b), a)

  return [relativePath1, relativePath2]
}

export async function codegen(mappingRoot: string, filename: string, content: string) {
  return new Promise<string>((resolve, reject) => {
    try {
      const filepath = path.join(mappingRoot, filename)
      fs.writeFileSync(filepath, content, 'utf-8')
      resolve(filename)
    }
    catch (error) {
      reject(error)
    }
  })
}
