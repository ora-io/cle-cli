import { describe, expect, it } from 'vitest'
import { parseTemplateTag } from '../packages/zkgraph-cli/src/tag'

describe('tag', () => {
  it('parse', () => {
    const value = parseTemplateTag('[root]/build/zkgraph_full.wasm', { root: '/project-root-path' })
    expect(value).toMatch('/project-root-path/build/zkgraph_full.wasm')
  })
})
