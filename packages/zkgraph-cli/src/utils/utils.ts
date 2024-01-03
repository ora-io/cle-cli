import { Md5 } from 'ts-md5'

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
