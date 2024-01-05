import fs from 'node:fs'
import path from 'node:path'
import to from 'await-to-js'
import FormData from 'form-data'
import * as zkgapi from '@hyperoracle/zkgraph-api'
import webjson from '@hyperoracle/zkgraph-lib/test/weblib/weblib.json'
import { createOnNonexist, fromHexString, loadYamlFromPath } from '../utils'
import { logger } from '../logger'

export interface CompileOptions {
  local: boolean
  yamlPath?: string
  compilerServerEndpoint: string
  wasmPath: string
  watPath: string
  mappingPath: string
}

export async function compile(options: CompileOptions) {
  const {
    wasmPath,
    watPath,
    local,
  } = options

  const succ = local ? await compileBasic(options) : await compileServer(options)

  if (succ)
    logCompileResult(wasmPath, watPath)
}

async function compileBasic(options: CompileOptions) {
  const {
    yamlPath,
    wasmPath,
    watPath,
    mappingPath,
    local,
  } = options
  if (!yamlPath) {
    logger.error('no yaml path provided')
    return false
  }

  const yaml = loadYamlFromPath(yamlPath)
  if (!yaml) {
    logger.error('[-] ERROR: Failed to get yaml')
    return false
  }

  const res = await zkgapi.compile({ zkgraphYaml: yaml }, {
    ...webjson,
    'mapping.ts': getMappingContent(mappingPath),
  }, { isLocal: local })

  if (res.error) {
    logger.error(`[-] COMPILATION ERROR. ${res.error.message}`)
    return false
  }
  if (res.stderr.toString()) {
    logger.error(`[-] COMPILATION ERROR. ${res.stderr.toString()}`)
    return false
  }
  const wasmContent = res.outputs['inner_pre_pre.wasm']
  const watContent = res.outputs['inner_pre_pre.wat']

  createOnNonexist(wasmPath)

  fs.writeFileSync(wasmPath, wasmContent)
  fs.writeFileSync(watPath, watContent)

  return true
}

async function compileServer(options: CompileOptions) {
  const {
    yamlPath,
    compilerServerEndpoint,
    wasmPath,
    watPath,
    // mappingPath,
  } = options
  if (!yamlPath) {
    logger.error('no yaml path provided')
    return false
  }

  const tmpWasmPath = path.join(path.dirname(wasmPath), '/temp/inner_pre_pre.wasm')
  const originWasmPath = options.wasmPath
  // set to tmp wasm path when local compile
  options.wasmPath = tmpWasmPath

  const succ = await compileBasic(options)
  if (!succ)
    return false
  // set back origin value
  options.wasmPath = originWasmPath

  // Set up form data
  const data = new FormData()
  // data.append("asFile", createReadStream(mappingPath));
  data.append('wasmFile', fs.createReadStream(tmpWasmPath))
  data.append('yamlFile', fs.createReadStream(yamlPath))

  const [requestErr, response] = await to(zkgapi.compileRequest(compilerServerEndpoint, data))

  if (requestErr) {
    console.error(requestErr)
    logger.error(`[-] ERROR WHEN COMPILING. ${requestErr.message}`)
    return false
  }
  if (!response) {
    logger.error('[-] ERROR WHEN COMPILING. invalid response')
    return false
  }
  const wasmModuleHex = response.data.wasmModuleHex
  const wasmWat = response.data.wasmWat

  createOnNonexist(wasmPath)
  fs.writeFileSync(wasmPath, fromHexString(wasmModuleHex))

  createOnNonexist(watPath)
  fs.writeFileSync(watPath, wasmWat)

  return true
}

function logCompileResult(wasmPath: string, watPath: string): void {
  // Log compiled file size by line count
  const compiledFileContent = fs.readFileSync(watPath, 'utf-8')
  const compiledFileLineCount = compiledFileContent.split('\n').length
  logger.info(`[*] ${compiledFileLineCount}${compiledFileLineCount > 1 ? ' lines' : ' line'} in ${watPath}`)
  // Log status
  logger.info(`[+] Output written to \`${path.dirname(wasmPath)}\` folder.`)
  logger.info('[+] COMPILATION SUCCESS!' + '\n')
}

function getMappingContent(filepath: string) {
  return fs.readFileSync(filepath, 'utf-8')
}
