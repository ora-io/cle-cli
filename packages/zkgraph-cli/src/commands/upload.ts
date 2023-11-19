// @ts-expect-error non-types
import { upload as uploadApi } from '@hyperoracle/zkgraph-api'
// import { computeAddress } from 'ethers/lib/utils.js'
import to from 'await-to-js'
import { logger } from '../logger'
import { checkPinataAuthentication } from '../utils'

export interface UploadOptions {
  local: boolean
  wasmPath: string
  // userPrivateKey: string
  yamlPath: string
  pinataEndpoint: string
  pinataJWT: string
  mappingPath: string
}

export async function upload(options: UploadOptions) {
  logger.info('>> UPLOAD')

  const { wasmPath, yamlPath, mappingPath, pinataEndpoint, pinataJWT } = options

  if (!await checkPinataAuthentication(pinataJWT)) {
    logger.error('[-] PINATA AUTHENTICATION FAILED.')
    return
  }

  // TODO: can we rm user addr from ipfs dir name?
  // const userAddress = computeAddress(userPrivateKey).toLowerCase()

  const [uploadErr, { isUploadSuccess, response, errorMessage }] = await to<any>(uploadApi(
    mappingPath,
    wasmPath,
    yamlPath,
    // userAddress,
    pinataEndpoint,
    pinataJWT,
    true,
  ))
  if (uploadErr) {
    logger.error(`[-] UPLOAD ERROR. ${uploadErr.message}`)
    return
  }
  if (isUploadSuccess) {
    logger.info('[+] IPFS UPLOAD SUCCESS!')
    logger.info(`[+] IPFS HASH: ${response.data.IpfsHash}`)
    if (response.data.isDuplicate)
      logger.info('[*] Please note that this upload is duplicated.')
  }
  else {
    logger.info('[-] IPFS UPLOAD FAILED.')
    logger.info(`[-] ${errorMessage}`)
  }

  return isUploadSuccess
}
