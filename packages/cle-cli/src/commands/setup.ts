import prompts from 'prompts'
import { waitSetup, zkwasm_imagedetails } from '@hyperoracle/cle-api-test'
import { logger } from '../logger'
import { TdConfig } from '../constants'
import { getDispatcher, uploadWasmToTd } from '../utils/td'
import { logLoadingAnimation, taskPrettyPrint } from '../utils'

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
  if (deatails[0]?.data.result[0] !== null) {
    const taskDetails = deatails[0]?.data.result[0]
    logger.warn('[*] IMAGE ALREADY EXISTS')
    logger.info(
      `[+] SET UP STATUS: ${taskDetails?.status}`,
    )
    logger.info(`[+] SET UP TASK ID: ${taskDetails.setup_task_id}`)
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
  if (!data) {
    logger.error('[+] SETUP TASK FAILED. The task result not found \n')
    return
  }
  const taskId = data.task?.id
  if (!taskId) {
    logger.error('[+] SETUP TASK FAILED. The task result not found \n')
    return
  }
  logger.info(`[+] SETUP TASK STARTED. TASK ID: ${taskId}`)
  logger.info('[*] Please wait for image set up... (estimated: 1-5 min)')
  const loading = logLoadingAnimation()

  const result = await waitSetup(zkWasmProviderUrl, taskId)
  loading.stopAndClear()
  taskPrettyPrint(result?.taskDetails, '[*] ')
  const taskStatus = result?.taskDetails?.status === 'Done' ? 'SUCCESS' : 'FAILED'
  logger.info(
    `[${taskStatus === 'SUCCESS' ? '+' : '-'}] SET UP ${taskStatus}`,
  )
  return result
}
