import fs from 'fs'
import { Md5 } from 'ts-md5'
import { ZkWasmUtil } from '@ora-io/zkwasm-service-helper'
import type { ProofParams } from '@ora-io/cle-api/index'
import { logger } from '../logger'
/**
 * Convert hex string to Uint8Array
 * @param hexString
 * @returns
 */
export function fromHexString(hexString: string) {
  hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString
  hexString = hexString.length % 2 ? `0${hexString}` : hexString
  return Uint8Array.from(Buffer.from(hexString, 'hex'))
}

/**
 * Convert Uint8Array to hex string
 * @param uint8array
 * @returns
 */
export function toHexString(uint8array: Uint8Array) {
  return Buffer.from(uint8array).toString('hex')
}

export function convertToMd5(value: Uint8Array): string {
  const md5 = new Md5()
  md5.appendByteArray(value)
  const hash = md5.end()
  if (!hash)
    return ''
  return hash.toString()
}

export function writeProofParamsFile(outputFilePath: string, proofParams: ProofParams) {
  let instancesStr = ''
  proofParams.instances.forEach((ins: Uint8Array, idx) => { instancesStr += `[${idx}]\n${toHexStringBytes32Reverse(ins)}` }) // 2 dim
  const batchInstancesStr = toHexStringBytes32Reverse(proofParams.batch_instances)
  const proofStr = toHexStringBytes32Reverse(proofParams.aggregate_proof)
  const auxStr = toHexStringBytes32Reverse(proofParams.aux)
  const extraStr = proofParams.extra ? toHexStringBytes32Reverse(proofParams.extra) : null

  fs.writeFileSync(
    outputFilePath,
    `Instances:\n${instancesStr // TODO: checkout how to return/write 2-dim instances
    }\n\nBatched Instances:\n${batchInstancesStr
    }\n\nProof transcripts:\n${proofStr
    }\n\nAux data:\n${auxStr
    // }${extraStr ? '\n\nExtra data:\n' : ''}${extraStr
    }\n\nExtra data:\n${extraStr
    }\n`,
  )
  logger.info(`[+] Proof written to ${outputFilePath}.\n`)
}

export function readProofParamsFile(outputFilePath: string): ProofParams {
  if (!fs.existsSync(outputFilePath)) {
    logger.error(`[-] ERROR: Proof file ${outputFilePath} doesn't exist.`)
    process.exit(1)
  }

  const content = fs.readFileSync(outputFilePath, 'utf-8')
  const regex = /Instances:\n(.*?)\n\nBatched Instances:\n(.*?)\n\nProof transcripts:\n(.*?)\n\nAux data:\n(.*?)\n\n/s
  const matches = content.match(regex)

  if (matches) {
    const instancesValue = matches[1].trim().split(/\[\d+\]/)// .filter(item => item !== '');
    if (instancesValue[0] === '')
      instancesValue.shift()
    const batchedInstancesValue = matches[2].trim().split('\n')
    const proofTranscriptsValue = matches[3].trim().split('\n')
    const auxDataValue = matches[4].trim().split('\n')
    return {
      instances: instancesValue.map((iv) => {
        const ivt = iv.trim()
        return (ivt.length > 0) ? ZkWasmUtil.hexStringsToBytes(ivt.split('\n'), 32) : new Uint8Array(0)
      }),
      batch_instances: ZkWasmUtil.hexStringsToBytes(batchedInstancesValue, 32),
      aggregate_proof: ZkWasmUtil.hexStringsToBytes(proofTranscriptsValue, 32),
      aux: ZkWasmUtil.hexStringsToBytes(auxDataValue, 32),
    }
  }
  else {
    logger.error(`[-] ERROR: Can't parse proof file ${outputFilePath}.`)
    process.exit(1)
  }
}

/**
 * Reverse Uint8Array to string
 * @param arr
 * @returns
 */
export function toHexStringBytes32Reverse(arr: Uint8Array) {
  let result = ''
  for (let i = 0; i < arr.length / 32; i++) {
    result
      += `0x${toHexString(arr.slice(i * 32, (i + 1) * 32).reverse())}\n`
  }
  return result
}
