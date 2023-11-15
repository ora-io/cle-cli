import fs from 'node:fs'
import prompts from 'prompts'
// @ts-expect-error non-types
import { ZkGraphYaml, waitDeploy } from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { convertToMd5, getTargetNetwork, logDivider } from '../utils'
import { TdConfig } from '../constants'
import { getDispatcher } from '../utils/td'

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
    // const yamlContent = fs.readFileSync(yamlPath, 'utf-8')

    // const yaml = await loadYaml(yamlContent)
    // if (!yaml) {
    //   logger.error('invalid yaml')
    //   return
    // }

    const zkgraphYaml = ZkGraphYaml.fromYamlPath(yamlPath)

    const inputtedNetworkName = zkgraphYaml.dataDestinations?.[0].network
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
  const wasmUint8Array = new Uint8Array(wasm)
  const md5 = convertToMd5(wasmUint8Array).toUpperCase()

  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: `You are going to publish a Deploy request to the Sepolia testnet, which would require ${TdConfig.fee} SepoliaETH. Proceed?`,
    initial: true,
  }, {
    onCancel: () => {
      logger.error('Operation cancelled')
    },
  })

  if (response.value === false) {
    logger.error('Operation cancelled')
    return
  }

  const dispatcher = getDispatcher(userPrivateKey)
  const tx = await dispatcher.deploy(md5, targetNetwork?.value)
  const txhash = tx.hash
  logger.info(
    `[+] Deploy Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
  )

  await tx.wait()

  logger.info('[+] Transaction Confirmed. Creating Deploy Task')

  const data = await dispatcher.queryTask(txhash)
  const taskId = data.task.id
  if (!taskId) {
    logger.error('[+] DEPLOY TASK FAILED. TASK ID IS NOT FOUND! \n')
    return
  }
  logger.info(`[+] DEPLOY TASK STARTED. TASK ID: ${taskId}`)

  const deployedVerificationContractAddress = await waitDeploy(
    zkWasmProviderUrl,
    taskId,
    md5,
    targetNetwork?.value,
    true,
  )

  logDivider()

  if (deployedVerificationContractAddress)
    logger.info(`[*] DEPLOYED VERIFICATION CONTRACT ADDRESS: ${deployedVerificationContractAddress}`)

  else
    logger.error('[-] DEPLOY FAILED.')
}
