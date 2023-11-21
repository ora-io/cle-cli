import { describe, expect, it } from 'vitest'
import { checkPinataAuthentication, fromHexString /* isEthereumAddress, loadZKGraphSources, parseYaml */ } from '../packages/zkgraph-cli/src/utils'

describe('utils', () => {
  it('test fromHexString', () => {
    expect(fromHexString('0x0000000000000000000000000000000000000000')).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
  })

  it('test checkPinataAuthentication', async () => {
    expect(await checkPinataAuthentication('')).toBeFalsy()
    expect(await checkPinataAuthentication('12132')).toBeFalsy()
  })
})
