import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { codegenImportReplace } from '../packages/zkgraph-cli/src/utils'

const commandsFixturesRoot = path.join(__dirname, 'fixtures/commands')

describe('test codegen utils', () => {
  it('test codegenImportReplace full', () => {
    const code = fs.readFileSync(path.join(commandsFixturesRoot, 'mapping.ts'), 'utf-8')
    expect(codegenImportReplace(code, 'test')).toMatchInlineSnapshot(`
      "//@ts-ignore
      import { Bytes, Block } from \\"test\\";

      export function handleBlocks(blocks: Block[]): Bytes {
        return Bytes.fromUTF8(\\"Hello zkGraph!\\");
      }
      "
    `)
  })
  it('test codegenImportReplace `@hyperoracle/zkgraph-lib/xxx/xxx`', () => {
    const code = 'import { require } from "@hyperoracle/zkgraph-lib/xxx/xxx";'
    expect(codegenImportReplace(code, 'test')).toBe('import { require } from "test/xxx/xxx";')
  })
  it('test codegenImportReplace `xxx/xxx/@hyperoracle/zkgraph-lib`', () => {
    const code = 'import { require } from "xxx/xxx/@hyperoracle/zkgraph-lib";'
    expect(codegenImportReplace(code, 'test')).toBe('import { require } from "xxx/xxx/@hyperoracle/zkgraph-lib";')
  })
})
