import fs from 'node:fs'
import path from 'node:path'
import { upload as uploadApi } from '@ora-io/cle-api'
import { computeAddress } from 'ethers/lib/utils'
import { logger } from '../logger'
import { checkPinataAuthentication, getRelativePaths, getTsFileTreeByDir, isTsFile, loadMappingPathFromYaml, loadYamlFromPath } from '../utils'

export interface UploadOptions {
  // local: boolean
  wasmPath: string
  userPrivateKey: string
  yamlPath: string
  pinataEndpoint: string
  pinataJWT: string
}

export async function upload(options: UploadOptions) {
  logger.info('>> UPLOAD')

  const { wasmPath, yamlPath, pinataEndpoint, pinataJWT, userPrivateKey } = options

  if (!await checkPinataAuthentication(pinataJWT)) {
    logger.error('[-] PINATA AUTHENTICATION FAILED.')
    return
  }

  const yaml = loadYamlFromPath(yamlPath)

  const yamlMappingPath = loadMappingPathFromYaml(yaml)
  if (!yamlMappingPath) {
    logger.error('[-] no mapping path provided in cle.yaml')
    return false
  }
  const mappingPath = path.join(path.dirname(yamlPath), yamlMappingPath)
  if (!isTsFile(mappingPath)) {
    logger.error('[-] mapping path provided in cle.yaml is not a ts file')
    return false
  }

  const userAddress = computeAddress(userPrivateKey).toLowerCase()

  // const mappingFile = fs.createReadStream(mappingPath)
  const wasmFile = fs.createReadStream(wasmPath)
  const yamlFile = fs.createReadStream(yamlPath)

  const dirPath = path.dirname(mappingPath)

  const paths = getTsFileTreeByDir(dirPath)
  const fileMap = {}
  paths.forEach((filePath) => {
    const relativePath = getRelativePaths(dirPath, [filePath])
    Reflect.set(fileMap, `src/${relativePath}`, fs.createReadStream(filePath))
  })

  const files = {
    'build/cle.wasm': wasmFile,
    'src/cle.yaml': yamlFile,
    ...fileMap,
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
