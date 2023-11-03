import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { codegenImportReplace } from '../packages/zkgraph-cli/src/utils'

const commandsFixturesRoot = path.join(__dirname, 'fixtures/commands')

describe('test codegen utils', () => {
  it('test codegenImportReplace full', () => {
    const code = fs.readFileSync(path.join(commandsFixturesRoot, 'mapping.ts'), 'utf-8')
    expect(codegenImportReplace(code, 'test')).toMatchInlineSnapshot(`
      "import { require } from \\"test\\";
      import { Bytes, Event, BigInt } from \\"test\\";

      export function handleEvents(events: Event[]): Bytes {
        let state = new Bytes(0);
        if (events.length > 0) {
          state = events[0].address;
        }
        require(state.length == 20);
        return state;
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
