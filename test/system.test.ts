import { describe, expect, it } from 'vitest'
import { checkExecExist } from '../packages/zkgraph-cli/src/utils/system'

describe('test system utils', () => {
  it('test checkExecExist', () => {
    expect(checkExecExist('node')).toBe(true)
    expect(checkExecExist('existCommand')).toBe(false)
  })
})
