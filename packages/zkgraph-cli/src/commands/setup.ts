import prompts from 'prompts'
// @ts-expect-error non-types
import { waitSetup, zkwasm_imagedetails } from '@hyperoracle/zkgraph-api'
import to from 'await-to-js'
import { logger } from '../logger'
import { TdConfig } from '../constants'
import { getDispatcher, uploadWasmToTd } from '../utils/td'

export interface SetupOptions {
  wasmPath: string
  circuitSize: number
  userPrivateKey: string
  zkWasmProviderUrl: string
}
export async function setup(options: SetupOptions) {
  const { wasmPath, circuitSize, zkWasmProviderUrl, userPrivateKey } = options

  logger.info('>> SET UP')

  if (!userPrivateKey) {
    logger.error('[-] USER PRIVATE KEY IS NOT DEFINED.')
    return
  }

  const md5 = await uploadWasmToTd(wasmPath)
  logger.info(`[*] IMAGE MD5: ${md5}`)

  const deatails = await zkwasm_imagedetails(zkWasmProviderUrl, md5)
  if (deatails[0].data.result[0] !== null) {
    logger.error('[*] IMAGE ALREADY EXISTS')
    return
  }

  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: `You are going to publish a Setup request to the Sepolia testnet, which would require ${TdConfig.fee} SepoliaETH. Proceed?`,
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
  const tx = await dispatcher.setup(md5, circuitSize)
  const txhash = tx.hash
  logger.info(
    `[+] Setup Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
  )
  await tx.wait()

  logger.info('[+] Transaction Confirmed. Creating Setup Task')
  const data = await dispatcher.queryTask(txhash)
  const taskId = data.task.id
  if (!taskId) {
    logger.error('[+] SETUP TASK FAILED. \n')
    return
  }
  logger.info(`[+] SETUP TASK STARTED. TASK ID: ${taskId}`)

  const [waitSetupErr, result] = await to(waitSetup(zkWasmProviderUrl, taskId, true))
  if (waitSetupErr) {
    logger.error(`[-] SETUP ERROR: ${waitSetupErr.message}`)
    return
  }
  return result
}
