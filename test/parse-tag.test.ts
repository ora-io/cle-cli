import { describe, expect, it } from 'vitest'
import { parseTemplateTag } from '../src/tag'

describe('tag', () => {
  it('parse', () => {
    const value = parseTemplateTag('[root]/build/cle.wasm', { root: '/project-root-path' })
    expect(value).toMatch('/project-root-path/build/cle.wasm')
  })
})
