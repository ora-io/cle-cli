import { describe, expect, it } from 'vitest'
import { checkPinataAuthentication, fromHexString, readProofParamsFile, writeProofParamsFile } from '../packages/cle-cli/src/utils'

describe('utils', () => {
  it('test fromHexString', () => {
    expect(fromHexString('0x0000000000000000000000000000000000000000')).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
  })

  it('test checkPinataAuthentication', async () => {
    expect(await checkPinataAuthentication('')).toBeFalsy()
    expect(await checkPinataAuthentication('12132')).toBeFalsy()
  })
  it('test writeProofParamsFile', () => {
    const proofParams = readProofParamsFile('/Users/xiaohang.yu/Documents/GitHub/zkgraph-cli/test/fixtures/utils/proof_0000.txt')

    writeProofParamsFile(
      '/Users/xiaohang.yu/Documents/GitHub/zkgraph-cli/test/fixtures/utils/proof_1111.txt',
      proofParams)
  })
  it('test readProofParamsFile', () => {
    const result = readProofParamsFile('/Users/xiaohang.yu/Documents/GitHub/zkgraph-cli/test/fixtures/utils/proof_65d9c90f429af08ed921eb29.txt')
    result.instances
    // console.log('test', result.instances)
  })
})
