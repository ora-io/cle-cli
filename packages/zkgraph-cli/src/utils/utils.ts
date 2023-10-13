import { ethers } from 'ethers'

/**
 * Check if the address is ethereum address
 * @param address
 * @returns
 */
export function isEthereumAddress(address: string) {
  try {
    const parsedAddress = ethers.utils.getAddress(address)
    return parsedAddress !== '0x0000000000000000000000000000000000000000'
  }
  catch (error) {
    return false
  }
}

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
 * Generate a random key
 * @param length
 * @returns
 */
export const randomUniqueKey = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const maxPos = chars.length
  let key = ''
  for (let i = 0; i < length; i++)
    key += chars.charAt(Math.floor(Math.random() * maxPos))

  return key
}
