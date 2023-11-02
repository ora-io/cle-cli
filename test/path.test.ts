import { platform } from 'node:os'
import { describe, expect, it } from 'vitest'
import { getRelativePath } from '../packages/zkgraph-cli/src/utils'

describe('test path', () => {
  it('test getRelativePath', () => {
    const path1 = 'xx/xx/node_modules/.zkgraph/mapping.ts'
    const path2 = 'xx/xx/node_modules/@hyperoracle/zkgraph-lib'
    const [relativePath1, relativePath2] = getRelativePath(path2, path1)
    if (platform() === 'win32') {
      expect(relativePath1).toBe('..\\.zkgraph\\mapping.ts')
      expect(relativePath2).toBe('..\\@hyperoracle\\zkgraph-lib')
    }
    else {
      expect(relativePath1).toBe('../.zkgraph/mapping.ts')
      expect(relativePath2).toBe('../@hyperoracle/zkgraph-lib')
    }
  })
})
