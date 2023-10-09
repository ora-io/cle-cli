export function fromHexString(hexString: string) {
  hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString
  hexString = hexString.length % 2 ? `0${hexString}` : hexString
  return Uint8Array.from(Buffer.from(hexString, 'hex'))
}

export function toHexString(bytes: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) {
  return Buffer.from(bytes).toString('hex')
}
