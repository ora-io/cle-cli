import { ethers } from 'ethers'
// @ts-expect-error non-types
import prompts from 'prompts'
import { waitSetup, zkwasm_imagedetails } from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { TdConfig } from '../constants'
import { getDispatcherContract, queryTaskId, uploadWasmToTd } from '../utils/td'

export interface SetupOptions {
  wasmPath: string
  circuitSize: number
  userPrivateKey: string
  zkWasmProviderUrl: string
}
export async function setup(options: SetupOptions) {
  const { wasmPath, circuitSize, zkWasmProviderUrl, userPrivateKey } = options

  logger.info('>> SET UP')

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

  const feeInWei = ethers.utils.parseEther(TdConfig.fee)
  const dispatcherContract = getDispatcherContract(userPrivateKey)
  const tx = await dispatcherContract.setup(md5, circuitSize, {
    value: feeInWei,
  })

  const txhash = tx.hash
  logger.info(
    `[+] Setup Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
  )

  await tx.wait()

  logger.info('[+] Transaction Confirmed. Creating Setup Task')
  const taskId = await queryTaskId(txhash)
  if (!taskId) {
    logger.error('[+] SETUP TASK FAILED. \n')
    return
  }
  logger.info(`[+] SETUP TASK STARTED. TASK ID: ${taskId}`)

  const result = await waitSetup(zkWasmProviderUrl, taskId, true)
  return result
}
