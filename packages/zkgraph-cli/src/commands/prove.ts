import fs from 'node:fs'
import { providers } from 'ethers'
import to from 'await-to-js'
import prompts from 'prompts'
// @ts-expect-error non-types
import * as zkgapi from '@hyperoracle/zkgraph-api'
import { convertToMd5, generateDspHubParams, loadJsonRpcProviderUrl, validateProvider } from '../utils'
import { logger } from '../logger'
import type { UserConfig } from '../config'
import { parseTemplateTag } from '../tag'
import { TAGS, TdConfig } from '../constants'
import { getDispatcher } from '../utils/td'

export interface ProveOptions {
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
  params?: string[]
}

export async function prove(options: ProveOptions) {
  const {
    params = [],
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

  const yaml = zkgapi.ZkGraphYaml.fromYamlPath(yamlPath)
  const dsp = zkgapi.dspHub.getDSPByYaml(yaml, { isLocal: false })
  if (!dsp) {
    logger.error('[-] ERROR: Failed to get DSP')
    return
  }
  const realParams = generateDspHubParams(dsp, params, 'prove')

  // Log script name
  switch (inputgen || test || prove) {
    // Input generation mode
    case options.inputgen === true:
      logger.info('>> PROVE: INPUT GENERATION MODE')
      break

    // Test mode
    case options.test === true:
      logger.info('>> PROVE: PRETEST MODE')
      logger.warn('>> PROVE: TEST MODE DOESN\'T OUTPUT PROOF FILE')
      break

    // Prove generation mode (prove-local will not have this option)
    case options.prove === true:
      logger.info('>> PROVE: PROVE MODE')
      logger.warn('>> PROVE: REQUIRE FINISH SETUP FIRST')
      break
  }

  const jsonRpcUrl = loadJsonRpcProviderUrl(yaml, jsonRpcProviderUrl, true)

  // TODO: do we still need this?
  const provider = new providers.JsonRpcProvider(jsonRpcUrl)
  const [validateErr] = await to(validateProvider(provider))
  if (validateErr) {
    logger.error(`[-] PROVIDER VALIDATION ERROR. ${validateErr.message}`)
    return
  }

  const wasm = fs.readFileSync(wasmPath)
  const wasmUint8Array = new Uint8Array(wasm)
  const md5 = convertToMd5(wasmUint8Array).toUpperCase()

  const proveParams = dsp.toProveParams(
    {
      jsonRpcUrl,
      ...realParams,
    },
  )

  const zkgraphExecutable = {
    wasmUint8Array,
    zkgraphYaml: yaml,
  }

  const [privateInputStr, publicInputStr] = await zkgapi.proveInputGen(
    zkgraphExecutable,
    proveParams,
    local,
    true,
  )

  if (inputgen) {
    // Input generation mode
    logger.info('[+] PRIVATE INPUT FOR ZKWASM:' + `\n${privateInputStr}`)
    logger.info('[+] PUBLIC INPUT FOR ZKWASM:' + `\n${publicInputStr}`)
  }
  else if (test) {
    // Test mode
    await testMode(wasmUint8Array, privateInputStr, publicInputStr)
  }
  else if (prove) {
    // Prove mode
    await proveMode(userPrivateKey, md5, privateInputStr, publicInputStr, zkWasmProviderUrl, outputProofFilePath)
  }
}
/**
 * test mode
 * @param wasmUint8Array
 * @param privateInputStr
 * @param publicInputStr
 */
async function testMode(wasmUint8Array: Uint8Array, privateInputStr: string, publicInputStr: string) {
  const zkgraphExecutable = {
    wasmUint8Array,
    zkgraphYaml: null,
  }

  const [mockErr, mockSuccess] = await to(zkgapi.proveMock(
    zkgraphExecutable,
    privateInputStr,
    publicInputStr,
  ))

  if (mockErr) {
    logger.error(`[-] ZKWASM MOCK EXECUTION ERROR: ${mockErr.message}`)
    return
  }

  if (mockSuccess) {
    logger.info('[+] ZKWASM MOCK EXECUTION SUCCESS!')
    if (zkgapi.hasDebugOnlyFunc)
      logger.warn('[+] PLEASE REMOVE DEBUG FUNCTION (e.g. console.log) BEFORE PROVE MODE')
    else
      logger.warn('[+] READY FOR PROVE MODE: zkgraph prove <block id> <expected state> --prove')
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
  const dispatcher = getDispatcher(userPrivateKey)
  const tx = await dispatcher.prove(md5, privateInputStr, publicInputStr)

  const txhash = tx.hash
  logger.info(
    `[+] Prove Request Transaction Sent: ${txhash}, Waiting for Confirmation`,
  )

  await tx.wait()

  logger.info('[+] Transaction Confirmed. Creating Prove Task')

  const data = await dispatcher.queryTask(txhash)
  const taskId = data.task.id
  if (!taskId) {
    logger.error('[+] PROVE TASK FAILED. \n')
    return
  }
  logger.info(`[+] PROVE TASK STARTED. TASK ID: ${taskId}`)

  logger.info('[+] WAITING FOR PROVE RESULT. ABOUT 3 TO 5 MINUTED')
  const [waitProveErr, result] = await to<any>(zkgapi.waitProve(zkWasmProviderUrl, taskId, true))
  if (waitProveErr) {
    logger.error(`[-] PROVE ERROR: ${waitProveErr.message}`)
    return
  }

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
