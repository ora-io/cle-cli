import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import to from 'await-to-js'
import FormData from 'form-data'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import * as zkgapi from '@hyperoracle/zkgraph-api'
import { codegen, createOnNonexist, fromHexString, loadYamlFromPath, randomUniqueKey } from '../utils'
import { logger } from '../logger'
import { parseTemplateTag } from '../tag'
import { COMPILE_CODEGEN, COMPILE_TEMP_ENTRY_FILE_NAME_TEMPLATE } from '../constants'
import { checkExecExist } from '../utils/system'

export interface CompileOptions {
  local: boolean
  yamlPath?: string
  compilerServerEndpoint: string
  wasmPath: string
  watPath: string
  mappingPath: string
}

const wasmStartName = '__as_start'

export async function compile(options: CompileOptions) {
  const {
    wasmPath,
    watPath,
    local,
  } = options
  if (!checkExecExist('asc') || !checkExecExist('npx asc')) {
    logger.error('[-] Please install assemblyscript in your package, you can run: npm install assemblyscript --save-dev')
    return
  }

  const succ = local ? await compileLocal(options) : await compileServer(options)

  if (succ)
    logCompileResult(wasmPath, watPath)
}

async function compileLocal(options: CompileOptions) {
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

  // general compile based on dsp. so local should be a boolean var rather than 'true'
  const dsp = zkgapi.dspHub.getDSPByYaml(yaml, { isLocal: local })
  if (!dsp) {
    logger.error('[-] ERROR: Failed to get DSP')
    return false
  }

  // for CODE_GEN code, define imported lib function name
  const libDSPName = dsp.getLibDSPName()

  const mappingFileName = yaml.mapping.file
  const handleFuncName = yaml.mapping.handler

  // for entry file name only, not important.
  const dspKey = zkgapi.dspHub.toHubKeyByYaml(yaml, { isLocal: local })

  const srcDirPath = path.join(mappingPath, '..')
  const entryFilename = getEntryFilename(dspKey)
  const entryFilePath = await codegen(srcDirPath, entryFilename, COMPILE_CODEGEN(libDSPName, mappingFileName, handleFuncName))

  // const innerPrePrePath = path.join(path.dirname(wasmPath), '/temp/inner_pre_pre.wasm')
  createOnNonexist(wasmPath)

  // const [compileErr] = await to(ascCompile(path.join(srcDirPath, entryFilePath), innerPrePrePath, `${innerPrePrePath}.wat`))
  const [compileErr] = await to(ascCompile(path.join(srcDirPath, entryFilePath), wasmPath, watPath))

  if (compileErr) {
    logger.error(`[-] COMPILATION ERROR. ${compileErr.message}`)
    return false
  }
  return true

  // logCompileResult(wasmPath, watPath)
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

  const succ = await compileLocal(options)
  if (!succ)
    return false
  // set back origin value
  options.wasmPath = originWasmPath

  // Set up form data
  const data = new FormData()
  // data.append("asFile", createReadStream(mappingPath));
  data.append('wasmFile', fs.createReadStream(tmpWasmPath))
  data.append('yamlFile', fs.createReadStream(yamlPath))

  // Set up request config
  const requestConfig: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: compilerServerEndpoint,
    headers: {
      ...data.getHeaders(),
    },
    data,
    timeout: 50000,
  }
  const [requestErr, response] = await to(axios.request(requestConfig))

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
  // logCompileResult(wasmPath, watPath)
}

async function ascCompile(entryFilePath: string, outputWasmPath: string, outputWatPath: string) {
  const abortPath = getAbortTsFilepath(entryFilePath)

  let commands: string[] = [
    'npx asc',
  ]
  const common = [
    `-o ${outputWasmPath}`,
    `-t ${outputWatPath}`,
    '-O', '--noAssert',
    '--disable', 'bulk-memory',
    '--disable', 'mutable-globals',
    '--exportRuntime',
    '--exportStart', wasmStartName,
    '--memoryBase', '70000',
    '--runtime stub',
  ]
  commands = commands.concat([
    entryFilePath,
    '--use', `abort=${abortPath}`,
  ])
  commands = commands.concat(common)

  return await execAndRmSync(commands.join(' '), entryFilePath)
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

async function execAndRmSync(command: string, filepath: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      execSync(command)
      // norman: rmSync should seperate from execSync
      fs.rmSync(filepath)
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

function getEntryFilename(env: string) {
  return parseTemplateTag(COMPILE_TEMP_ENTRY_FILE_NAME_TEMPLATE, {
    env,
    salt: randomUniqueKey(10),
  })
}

function getAbortTsFilepath(innerTsFilePath: string) {
  return `${innerTsFilePath.replace(process.cwd(), '').substring(1).replace('.ts', '')}/abort`.replaceAll('\\', '/')
}
