// @ts-expect-error non-types
import { upload as uploadApi } from '@hyperoracle/zkgraph-api'
import { logger } from '../logger'
import { checkPinataAuthentication, logDivider } from '../utils'
export interface UploadOptions {
  local: boolean
  wasmPath: string
  userPrivateKey: string
  yamlPath: string
  pinataEndpoint: string
  pinataJWT: string
  mappingPath: string
}

export async function upload(options: UploadOptions) {
  logger.info('>> UPLOAD')

  const { wasmPath, userPrivateKey, yamlPath, mappingPath, pinataEndpoint, pinataJWT } = options

  if (!await checkPinataAuthentication(pinataJWT)) {
    logger.error('[-] PINATA AUTHENTICATION FAILED.')
    return
  }

  const isUploadSuccess = await uploadApi(
    mappingPath,
    wasmPath,
    yamlPath,
    userPrivateKey,
    pinataEndpoint,
    pinataJWT,
    true,
  )

  logDivider()
  if (isUploadSuccess)
    logger.info('>> UPLOAD SUCCESS')

  else
    logger.error('>> UPLOAD FAILED')

  return isUploadSuccess
}
