import path from 'node:path'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { compile } from '../packages/zkgraph-cli/src/commands/compile'
import { createLogger } from '../packages/zkgraph-cli/src/logger'
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
      compilerServerEndpoint: 'http://compiler.hyperoracle.io/compile',
      wasmPath,
      watPath,
      logger: createLogger(),
      mappingPath,
    })
    const hasWasm = fs.existsSync(wasmPath)
    const hasWat = fs.existsSync(watPath)
    expect(hasWasm).toBeTruthy()
    expect(hasWat).toBeTruthy()

    const wasm = fs.readFileSync(wasmPath)
    const wasmUint8Array = new Uint8Array(wasm)

    const inst = await instantiateWasm(wasmUint8Array)
    // inst.full_run()
    expect(inst.inner(1, 1, 1, 1)).toBeTypeOf('number')
    expect(inst.inner).not.toBeUndefined()
    expect(inst.asmain).not.toBeUndefined()
    expect(inst.zkmain).not.toBeUndefined()

    if (hasWasm)
      fs.rmSync(wasmPath)
    if (hasWat)
      fs.rmSync(watPath)
  }, 100000)

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
      logger: createLogger(),
      mappingPath,
    })
    const hasWasm = fs.existsSync(wasmPath)
    const hasWat = fs.existsSync(watPath)
    expect(hasWasm).toBeTruthy()
    expect(hasWat).toBeTruthy()
    const wasm = fs.readFileSync(wasmPath)
    const wasmUint8Array = new Uint8Array(wasm)

    const inst = await instantiateWasm(wasmUint8Array)

    // expect(inst.local_run).not.toBeUndefined()
    expect(inst.asmain).not.toBeUndefined()
    expect(inst.zkmain).not.toBeUndefined()

    if (hasWasm)
      fs.rmSync(wasmPath)
    if (hasWat)
      fs.rmSync(watPath)
  }, 100000)
})
