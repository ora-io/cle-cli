import fs from 'node:fs'
import { ethers, providers } from 'ethers'
import to from 'await-to-js'
import prompts from 'prompts'
// @ts-expect-error non-types
import { getBlockByNumber, getRawReceipts, proveInputGenOnRawReceipts, proveMock, waitProve } from '@hyperoracle/zkgraph-api'
import { convertToMd5, loadJsonRpcProviderUrl, loadYaml, validateProvider } from '../utils'
import { logger } from '../logger'
import type { UserConfig } from '../config'
import { parseTemplateTag } from '../tag'
import { TAGS, TdConfig } from '../constants'
import { getDispatcherContract, queryTaskId } from '../utils/td'

export interface ProveOptions {
  blockId: number
  expectedState: string
  inputgen: boolean
  test: boolean
  prove: boolean
  local: boolean
  wasmPath: string
  yamlPath: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  zkWasmProviderUrl: string
  userPrivateKey: string
  outputProofFilePath: string
}

// type ProveMode = 'inputgen' | 'test' | 'prove'

export async function prove(options: ProveOptions) {
  const {
    blockId,
    expectedState,
    inputgen,
    test,
    prove,
    local,
    wasmPath,
    yamlPath,
    jsonRpcProviderUrl,
    zkWasmProviderUrl,
    userPrivateKey,
    outputProofFilePath,
  } = options

  // Log script name
  switch (inputgen || test || prove) {
    // Input generation mode
    case options.inputgen === true:
      logger.info('>> PROVE: INPUT GENERATION MODE')
      break

    // Test mode
    case options.test === true:
      logger.info('>> PROVE: PRETEST MODE')
      logger.warn('>> PROVE: TEST MODE WILL NOT OUTPUT PROOF FILE')
      break

    // Prove generation mode (prove-local will not have this option)
    case options.prove === true:
      logger.info('>> PROVE: PROVE MODE')
      logger.warn('>> PROVE: REQUIRE FINISH SETUP FIRST')
      break
  }

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  const yaml = await loadYaml(yamlContent)
  if (!yaml) {
    logger.error('invalid yaml')
    return
  }
  const JsonRpcProviderUrl = loadJsonRpcProviderUrl(yaml, jsonRpcProviderUrl, true)

  const provider = new providers.JsonRpcProvider(JsonRpcProviderUrl)
  const [validateErr] = await to(validateProvider(provider))
  if (validateErr) {
    logger.error(`[-] PROVIDER VALIDATION ERROR. ${validateErr.message}`)
    return
  }

  const [rawReceiptListErr, rawReceiptList] = await to(getRawReceipts(provider, blockId, false))
  if (rawReceiptListErr) {
    logger.error(`[-] GET RECEIPT ERROR. ${rawReceiptListErr.message}`)
    return
  }

  const [simpleblockErr, simpleblock] = await to(provider.getBlock(blockId))
  if (simpleblockErr) {
    logger.error('[-] ERROR: Failed to getBlock()')
    return
  }

  const [blockErr, block] = await to(getBlockByNumber(provider, simpleblock?.number))
  if (blockErr) {
    logger.error('[-] ERROR: Failed to getBlockByNumber()')
    return
  }

  const blockNumber = Number((block as any).number)
  const blockHash = (block as any).hash
  const receiptsRoot = (block as any).receiptsRoot

  const wasm = fs.readFileSync(wasmPath)
  const wasmUnit8Array = new Uint8Array(wasm)
  const md5 = convertToMd5(wasmUnit8Array).toUpperCase()

  const [privateInputStr, publicInputStr] = await proveInputGenOnRawReceipts(
    yamlContent,
    rawReceiptList,
    blockNumber,
    blockHash,
    receiptsRoot,
    expectedState,
    local,
    true,
  )

  if (inputgen) {
    // Input generation mode
    logger.info(`[+] ZKGRAPH STATE OUTPUT:${expectedState}`)
    logger.info('[+] PRIVATE INPUT FOR ZKWASM:' + `\n${privateInputStr}`)
    logger.info('[+] PUBLIC INPUT FOR ZKWASM:' + `\n${publicInputStr}`)
  }
  else if (test) {
    // Test mode
    await testMode(wasmUnit8Array, privateInputStr, publicInputStr)
  }
  else if (prove) {
    // Prove mode
    await proveMode(userPrivateKey, md5, privateInputStr, publicInputStr, zkWasmProviderUrl, outputProofFilePath)
  }
}
/**
 * test mode
 * @param wasmUnit8Array
 * @param privateInputStr
 * @param publicInputStr
 */
async function testMode(wasmUnit8Array: Uint8Array, privateInputStr: string, publicInputStr: string) {
  const mockSuccess = await proveMock(
    wasmUnit8Array,
    privateInputStr,
    publicInputStr,
  )

  if (mockSuccess) {
    logger.info('[+] ZKWASM MOCK EXECUTION SUCCESS!')
    logger.info('[+] REAL PROOF PLEASE RUN: zkgraph prove <block id> <expected state> --prove')
  }
  else { logger.error('[-] ZKWASM MOCK EXECUTION FAILED') }
}

/**
 * prove mode
 * @param userPrivateKey
 * @param md5
 * @param privateInputStr
 * @param publicInputStr
 * @param zkWasmProviderUrl
 * @param outputProofFilePath
 * @returns
 */
async function proveMode(userPrivateKey: string, md5: string, privateInputStr: string, publicInputStr: string, zkWasmProviderUrl: string, outputProofFilePath: string) {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: `You are going to publish a Prove request to the Sepolia testnet, which would require ${TdConfig.fee} SepoliaETH. Proceed?`,
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
  const tx = await dispatcherContract.prove(
    md5,
    privateInputStr,
    publicInputStr,
    {
      value: feeInWei,
    },
  )

  const txhash = tx.hash
  logger.info(
    `[+] Prove Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
  )

  await tx.wait()

  logger.info('[+] Transaction Confirmed. Creating Prove Task')

  const taskId = await queryTaskId(txhash)
  if (!taskId) {
    logger.error('[+] PROVE TASK FAILED. \n')
    return
  }
  logger.info(`[+] PROVE TASK STARTED. TASK ID: ${taskId}`)

  logger.info('[+] WAITING FOR PROVE RESULT. ABOUT 3 TO 5 MINUTED')
  const result = await waitProve(zkWasmProviderUrl, taskId, true)

  if (
    result.instances === null
    && result.batch_instances === null
    && result.proof === null
    && result.aux === null
  ) {
    logger.warn('[-] PROOF NOT FOUND')
    return
  }

  // write proof to file as txt
  const outputProofFile = parseTemplateTag(outputProofFilePath, {
    ...TAGS,
    taskId: result.taskId,
  })

  logger.info(`[+] Proof written to ${outputProofFile}.\n`)

  fs.writeFileSync(
    outputProofFile,
    `Instances:\n${result.instances
    }\n\nBatched Instances:\n${result.batch_instances
    }\n\nProof transcripts:\n${result.proof
    }\n\nAux data:\n${result.aux
    }\n`,
  )
}
