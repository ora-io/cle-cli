import fs from 'node:fs'
// @ts-expect-error non-types
import { verify as verifyApi } from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { logDivider } from '../utils'

export interface VerifyOptions {
  local: boolean
  taskId: string
  yamlPath: string
  zkWasmProviderUrl: string
}
export async function verify(options: VerifyOptions) {
  logger.info('>> VERIFY PROOF ONCHAIN')
  const { yamlPath, taskId, zkWasmProviderUrl } = options
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')

  const verifyResult = await verifyApi(
    yamlContent,
    taskId,
    zkWasmProviderUrl,
    true,
  )
  logDivider()

  if (verifyResult)
    logger.info('>> VERIFY PROOF ONCHAIN SUCCESS')

  else
    logger.error('>> VERIFY PROOF ONCHAIN FAILED')

  return verifyResult
}
