import fs from 'node:fs'
import { providers } from 'ethers'
import to from 'await-to-js'
import prompts from 'prompts'
import * as zkgapi from '@ora-io/cle-api'
import type { Input } from 'zkwasm-toolchain'
import { convertToMd5, generateDspHubParams, loadJsonRpcProviderUrl, loadYamlFromPath, logLoadingAnimation, taskPrettyPrint, validateProvider } from '../utils'
import { logger } from '../logger'
import type { UserConfig } from '../config'
import { parseTemplateTag } from '../tag'
import { TAGS, TdConfig } from '../constants'
import { getDispatcher } from '../utils/td'

export interface ProveOptions {
  inputgen: boolean
  test: boolean
  prove: boolean
  // local: boolean
  wasmPath: string
  yamlPath: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  zkWasmProviderUrl: string
  userPrivateKey: string
  outputProofFilePath: string
  params?: any[]
}

export async function prove(options: ProveOptions) {
  const {
    params = [],
    inputgen,
    test,
    prove,
    // local,
    wasmPath,
    yamlPath,
    jsonRpcProviderUrl,
    zkWasmProviderUrl,
    userPrivateKey,
    outputProofFilePath,
  } = options

  const yaml = loadYamlFromPath(yamlPath)
  if (!yaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }
  const dsp = zkgapi.dspHub.getDSPByYaml(yaml)
  if (!dsp) {
    logger.error('[-] ERROR: Failed to get DSP')
    return
  }
  const [generateErr, realParams] = await to(generateDspHubParams(dsp, params, 'prove'))
  if (generateErr) {
    // eslint-disable-next-line no-console
    console.log(generateErr.message)
    return
  }

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
      provider,
      ...realParams,
    },
  )

  const cleExecutable = {
    wasmUint8Array,
    cleYaml: yaml as zkgapi.CLEYaml,
  }

  const input = await zkgapi.proveInputGen(
    cleExecutable,
    proveParams,
  )

  if (inputgen) {
    // Input generation mode
    logger.info('[+] PRIVATE INPUT FOR ZKWASM:' + `\n${input.getPrivateInputStr()}`)
    logger.info('[+] PUBLIC INPUT FOR ZKWASM:' + `\n${input.getPublicInputStr()}`)
  }
  else if (test) {
    // Test mode
    await testMode(wasmUint8Array, input)
  }
  else if (prove) {
    // Prove mode
    await proveMode(userPrivateKey, md5, input.getPrivateInputStr(), input.getPublicInputStr(), zkWasmProviderUrl, outputProofFilePath)
  }
}
/**
 * test mode
 * @param wasmUint8Array
 * @param privateInputStr
 * @param publicInputStr
 */
async function testMode(wasmUint8Array: Uint8Array, input: Input) {
  const cleExecutable = {
    wasmUint8Array,
    cleYaml: null,
  }

  const [mockErr, mockSuccess] = await to(zkgapi.proveMock(
    cleExecutable,
    input,
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
      logger.warn('[+] READY FOR PROVE MODE: npx cle prove <block id> <expected state> --prove')
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

  const [queryTaskErr, data] = await to(dispatcher.queryTask(txhash))
  if (queryTaskErr) {
    if (queryTaskErr instanceof zkgapi.Error.TDNoTaskFound) {
      logger.error('[-] PLEASE REQUIRE FINISH SETUP FIRST.')
      return
    }
    else {
      throw queryTaskErr
    }
  }
  const taskId = data?.task?.id
  if (!taskId) {
    logger.error('[+] PROVE TASK FAILED. \n')
    return
  }
  logger.info(`[+] PROVE TASK STARTED. TASK ID: ${taskId}`)
  logger.info('[+] WAITING FOR PROVE RESULT. ABOUT 3 TO 5 MINUTES')

  const loading = logLoadingAnimation()

  const [err, result] = await to(zkgapi.waitProve(zkWasmProviderUrl, taskId))

  if (err) {
    loading.stopAndClear()
    throw err
  }
  if (result?.status === 'Done') {
    logger.info('[+] PROVE SUCCESS!')
    taskPrettyPrint(result.taskDetails)
  }
  else {
    logger.error('[-] PROVE OR DRYRUN FAILED.')
    loading.stopAndClear()
    return
  }
  loading.stopAndClear()
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
    taskId: result.taskId || '',
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
