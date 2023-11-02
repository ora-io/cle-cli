import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getTsFiles, isTsFile } from '../packages/zkgraph-cli/src/utils'

const utilsFixturesRoot = path.join(__dirname, 'fixtures/utils')

describe('test file utils', () => {
  it('test isTsFile', () => {
    expect(isTsFile(path.join(__dirname, 'fixtures/file.test.ts'))).toBe(true)
    expect(isTsFile(path.join(__dirname, 'fixtures/file.test.js'))).toBe(false)
  })
  it('test getTsFiles', () => {
    const dir = path.join(utilsFixturesRoot, 'ts_files')
    const files = [
      path.join(dir, '1.ts'),
      path.join(dir, '2.ts'),
      path.join(dir, '3/3.ts'),
      path.join(dir, '3/4/4.ts'),
    ]
    expect(getTsFiles(dir)).toEqual(files)
    expect(getTsFiles(path.join(utilsFixturesRoot, 'null_dir')).length).toBe(0)
  })
})
