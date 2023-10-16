import fs from 'node:fs'
// @ts-expect-error non-types
import { deploy as deployApi } from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { getTargetNetwork, loadYaml, loadZKGraphDataDestinations, logDivider } from '../utils'

export interface DeployOptions {
  wasmPath: string
  network: string
  local: boolean
  userPrivateKey: string
  zkWasmProviderUrl: string
  yamlPath: string
}

export async function deploy(options: DeployOptions) {
  const { wasmPath, network, zkWasmProviderUrl, userPrivateKey, yamlPath } = options
  logger.info('>> DEPLOY VERIFICATION CONTRACT')

  let targetNetwork: ReturnType<typeof getTargetNetwork> | undefined

  if (!network) {
    const yamlContent = fs.readFileSync(yamlPath, 'utf-8')

    const yaml = await loadYaml(yamlContent)
    if (!yaml) {
      logger.error('invalid yaml')
      return
    }

    const inputtedNetworkName = loadZKGraphDataDestinations(yaml)?.[0].network
    if (!inputtedNetworkName) {
      logger.error('[-] NETWORK NAME IS NOT DEFINED IN YAML.')
      return
    }
    targetNetwork = getTargetNetwork(inputtedNetworkName)
  }
  else {
    targetNetwork = getTargetNetwork(network)
  }

  const wasm = fs.readFileSync(wasmPath)
  const wasmUnit8Array = new Uint8Array(wasm)

  const deployedVerificationContractAddress = await deployApi(
    wasmUnit8Array,
    targetNetwork?.value,
    zkWasmProviderUrl,
    userPrivateKey,
    true,
  )
  logDivider()

  if (deployedVerificationContractAddress)
    logger.info(`[*] DEPLOYED VERIFICATION CONTRACT ADDRESS: ${deployedVerificationContractAddress}`)

  else
    logger.error('[-] DEPLOY FAILED.')
}
