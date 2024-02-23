import fs from 'node:fs'
import type { ProofParams } from '@ora-io/cle-api'
import { Error, constants, verify as verifyApi } from '@ora-io/cle-api'
import { ethers } from 'ethers'
import { ZkWasmUtil } from '@ora-io/zkwasm-service-helper'
import { logger } from '../logger'
import { loadJsonRpcProviderUrl, loadYamlFromPath, logDivider } from '../utils'
import type { UserConfig } from '../config'
import { parseTemplateTag } from '../tag'
import { TAGS } from '../constants'

export interface VerifyOptions {
  taskId: string
  yamlPath: string
  zkWasmProviderUrl: string
  jsonRpcProviderUrl: UserConfig['JsonRpcProviderUrl']
  outputProofFilePath: string
}
export async function verify(options: VerifyOptions) {
  logger.info('>> VERIFY PROOF ONCHAIN')
  const { yamlPath, taskId, jsonRpcProviderUrl, outputProofFilePath } = options

  const cleYaml = loadYamlFromPath(yamlPath)
  if (!cleYaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return
  }

  const jsonRpcUrl = loadJsonRpcProviderUrl(cleYaml, jsonRpcProviderUrl, false)

  // Get deployed verification contract address.
  // TODO: I reused this func to save code, but the naming is a bit misleading, fix it later.
  // const verifierAddress = loadJsonRpcProviderUrl(cleYaml, AggregatorVerifierAddress, false)
  const proofParams = getVerifyProofParamsByProofFile(taskId, outputProofFilePath)
  const network = cleYaml.decidePublishNetwork()
  if (!network) {
    logger.error('[-] ERROR: Failed to get network')
    return
  }
  const verifierAddress = (constants.AggregatorVerifierAddress as any)[network]

  const verifyResult = await verifyApi(
    proofParams,
    { verifierAddress, provider: new ethers.providers.JsonRpcProvider(jsonRpcUrl) },
  ).catch((error: Error) => {
    if (error instanceof Error.ProveTaskNotReady)
      logger.error(`>> PROOF IS NOT READY. ${error.message}`)
  })

  logDivider()

  if (verifyResult)
    logger.info('>> VERIFY PROOF ONCHAIN SUCCESS')

  else
    logger.error('>> VERIFY PROOF ONCHAIN FAILED')

  return verifyResult
}

function getVerifyProofParamsByProofFile(taskId: string, outputProofFilePath: string): ProofParams {
  const outputProofFile = parseTemplateTag(outputProofFilePath, {
    ...TAGS,
    taskId: taskId || '',
  })

  const content = fs.readFileSync(outputProofFile, 'utf-8')
  const regex = /Instances:\n(.*?)\n\nBatched Instances:\n(.*?)\n\nProof transcripts:\n(.*?)\n\nAux data:\n(.*?)\n\n/s
  const matches = content.match(regex)

  if (matches) {
    const instancesValue = matches[1].trim().split('\n')
    const batchedInstancesValue = matches[2].trim().split('\n')
    const proofTranscriptsValue = matches[3].trim().split('\n')
    const auxDataValue = matches[4].trim().split('\n')

    return {
      instances: ZkWasmUtil.hexStringsToBytes(instancesValue, 32),
      batch_instances: ZkWasmUtil.hexStringsToBytes(batchedInstancesValue, 32),
      aggregate_proof: ZkWasmUtil.hexStringsToBytes(proofTranscriptsValue, 32),
      aux: ZkWasmUtil.hexStringsToBytes(auxDataValue, 32),
    }
  }
  else {
    logger.error('[-] ERROR: Failed to get proof file')
    process.exit(1)
  }
}
