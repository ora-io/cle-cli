import fs from 'node:fs'
import { providers } from 'ethers'
import to from 'await-to-js'
// @ts-expect-error non-types
import { getBlockByNumber, getRawReceipts, prove as proveApi, proveInputGenOnRawReceipts, proveMock } from '@hyperoracle/zkgraph-api'
import { loadJsonRpcProviderUrl, loadYaml, validateProvider } from '../utils'
import { logger } from '../logger'
import type { UserConfig } from '../config'
import { parseTemplateTag } from '../tag'
import { TAGS } from '../constants'

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
      break

    // Prove generation mode (prove-local will not have this option)
    case options.prove === true:
      logger.info('>> PROVE: PROVE MODE')
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

    const mockSuccess = await proveMock(
      wasmUnit8Array,
      privateInputStr,
      publicInputStr,
    )

    if (mockSuccess)
      logger.info('[+] ZKWASM MOCK EXECUTION SUCCESS!')

    else
      logger.error('[-] ZKWASM MOCK EXECUTION FAILED')
  }
  else if (prove) {
    // Prove mode
    const result = await proveApi(
      wasmUnit8Array,
      privateInputStr,
      publicInputStr,
      zkWasmProviderUrl,
      userPrivateKey,
      true,
    )

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
}
