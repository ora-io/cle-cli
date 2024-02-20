import fs from 'node:fs'
import { upload as uploadApi } from '@ora-io/cle-api'
import { computeAddress } from 'ethers/lib/utils'
import { logger } from '../logger'
import { checkPinataAuthentication, loadYamlFromPath } from '../utils'

export interface UploadOptions {
  // local: boolean
  wasmPath: string
  userPrivateKey: string
  yamlPath: string
  pinataEndpoint: string
  pinataJWT: string
  mappingPath: string
}

export async function upload(options: UploadOptions) {
  logger.info('>> UPLOAD')

  const { wasmPath, yamlPath, mappingPath, pinataEndpoint, pinataJWT, userPrivateKey } = options

  if (!await checkPinataAuthentication(pinataJWT)) {
    logger.error('[-] PINATA AUTHENTICATION FAILED.')
    return
  }

  const yaml = loadYamlFromPath(yamlPath)

  const userAddress = computeAddress(userPrivateKey).toLowerCase()

  const mappingFile = fs.createReadStream(mappingPath)
  const wasmFile = fs.createReadStream(wasmPath)
  const yamlFile = fs.createReadStream(yamlPath)
  const files = {
    'src/mapping.ts': mappingFile,
    'build/cle.wasm': wasmFile,
    'src/cle.yaml': yamlFile,
  }
  const directoryTag = { userAddress, graphName: yaml.name }
  const directoryName = `${directoryTag.graphName}-${directoryTag.userAddress}`

  const { isUploadSuccess, response, errorMessage } = await uploadApi(
    files,
    {
      pinataEndpoint,
      pinataJWT,
      directoryName,
    },
  )
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
