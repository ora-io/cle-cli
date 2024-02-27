import { describe, expect, it } from 'vitest'
import { generateDspHubParamsMap } from '../packages/cle-cli/src/utils'
import { dspHub } from './mock/dsp'

describe('test dsp utils', () => {
  it('test generateDspHubParamsMap', () => {
    expect(generateDspHubParamsMap(dspHub.hub as any)).toMatchInlineSnapshot(`
      {
        "test1": {
          "execParams": [
            "a",
            "b",
          ],
          "proveParams": [
            "c",
            "d",
          ],
        },
        "test2": {
          "execParams": [
            "1",
            "2",
          ],
          "proveParams": [
            "3",
            "4",
          ],
        },
      }
    `)
  })
})
