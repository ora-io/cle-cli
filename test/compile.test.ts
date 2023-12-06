import path from 'node:path'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { compile } from '../packages/zkgraph-cli/src/commands/compile'
import { instantiateWasm } from './utils/wasm'

const commandsFixturesRoot = path.join(__dirname, 'fixtures/commands')
const projectRoot = process.cwd()

describe('compile', () => {
  // TODO: This is temporary
  it.runIf(process.platform !== 'win32')('full', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'zkgraph.yaml')
    const wasmPath = path.join(projectRoot, 'temp/zkgraph_full.wasm')
    const watPath = wasmPath.replace(/\.wasm/, '.wat')
    const mappingPath = path.join(commandsFixturesRoot, 'mapping.ts')

    await compile({
      yamlPath,
      local: false,
      compilerServerEndpoint: 'http://compiler.dev.hyperoracle.io/compile',
      wasmPath,
      watPath,
      mappingPath,
    })
    const hasWasm = fs.existsSync(wasmPath)
    const hasWat = fs.existsSync(watPath)
    expect(hasWasm).toBeTruthy()
    expect(hasWat).toBeTruthy()

    const wasm = fs.readFileSync(wasmPath)
    const wasmUint8Array = new Uint8Array(wasm)

    const inst = await instantiateWasm(wasmUint8Array)

    expect(inst.asmain).not.toBeUndefined()
    expect(inst.zkmain).not.toBeUndefined()
  }, 200000)

  it('local', async () => {
    const yamlPath = path.join(commandsFixturesRoot, 'zkgraph.yaml')
    const wasmPath = path.join(projectRoot, 'temp/zkgraph_local.wasm')
    const watPath = wasmPath.replace(/\.wasm/, '.wat')
    const mappingPath = path.join(commandsFixturesRoot, 'mapping.ts')

    await compile({
      yamlPath,
      local: true,
      compilerServerEndpoint: '',
      wasmPath,
      watPath,
      mappingPath,
    })
    const hasWasm = fs.existsSync(wasmPath)
    const hasWat = fs.existsSync(watPath)
    expect(hasWasm).toBeTruthy()
    expect(hasWat).toBeTruthy()
  }, 100000)
})
