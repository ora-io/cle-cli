import { execSync } from 'node:child_process'
import fs from 'node:fs'
import to from 'await-to-js'
import FormData from 'form-data'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { fromHexString, loadZKGraphSources, parseYaml } from '../utils'
import type { ZkGraphYaml } from '../types'
import { type Logger, createLogger } from '../logger'
import { zkGraphCache } from '../cache'

export interface CompileOptions {
  local: boolean
  yamlPath?: string
  logger?: Logger
  compilerServerEndpoint: string
  wasmPath: string
  watPath: string
  mappingPath: string
}

const innerPrePrePath = `${process.cwd()}/temp/inner_pre_pre.wasm`
const wasmStartName = '__as_start'

// const ascBin = path.join(`${__dirname}`, '../..', 'node_modules/.bin/asc')

export async function compile(options: CompileOptions) {
  const {
    local,
  } = options
  if (local)
    await compileLocal(options)
  else
    await compileServer(options)
}

async function compileServer(options: CompileOptions) {
  const {
    yamlPath,
    logger = createLogger(),
    compilerServerEndpoint,
    wasmPath,
    watPath,
    mappingPath,
  } = options
  if (!yamlPath) {
    logger.error('no yaml path provided')
    return
  }
  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  const [yamlErr, yaml] = await to(parseYaml<Partial<ZkGraphYaml>>(yamlContent))
  if (yamlErr) {
    logger.error(`[-] LOAD YAML ERROR. ${yamlErr.message}`)
    return
  }
  if (!yaml) {
    logger.error('invalid yaml')
    return
  }

  const [source_address, source_esigs] = loadZKGraphSources(yaml)
  logger.info(`[*] Source contract address:${source_address}`)
  logger.info(`[*] Source events signatures:${source_esigs}` + '\n')

  // const mappingRoot = path.join(mappingPath, '..')
  // const entryFilename = getEntryFilename('full')
  // const innerFile = await codegen(mappingRoot, entryFilename, COMPILE_CODEGEN)
  zkGraphCache.copyDirToCacheDir(mappingPath)
  const [compileErr] = await to(ascCompile('node_modules/.zkgraph/common/inner.ts'))

  if (compileErr) {
    logger.error(`[-] COMPILATION ERROR. ${compileErr.message}`)
    return
  }

  // Set up form data
  const data = new FormData()
  // data.append("asFile", createReadStream(mappingPath));
  data.append('wasmFile', fs.createReadStream(innerPrePrePath))
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
    logger.error(`[-] ERROR WHEN COMPILING. ${requestErr.message}`)
    return
  }
  if (!response) {
    logger.error('[-] ERROR WHEN COMPILING. invalid response')
    return
  }
  const wasmModuleHex = response.data.wasmModuleHex
  const wasmWat = response.data.wasmWat
  fs.writeFileSync(wasmPath, fromHexString(wasmModuleHex))
  fs.writeFileSync(watPath, wasmWat)

  // Log compiled file size by line count
  const compiledFileContent = fs.readFileSync(watPath, 'utf-8')
  const compiledFileLineCount = compiledFileContent.split('\n').length
  logger.info(`[*]${compiledFileLineCount}${compiledFileLineCount > 1 ? 'lines' : 'line'}in ${watPath}`)
  // Log status
  logger.info('[+] Output written to `build` folder.')
  logger.info('[+] COMPILATION SUCCESS!' + '\n')
  zkGraphCache.clearCacheDir()
}

async function compileLocal(options: CompileOptions) {
  const {
    wasmPath,
    watPath,
    mappingPath,
    logger = createLogger(),
  } = options
  // const mappingRoot = path.join(mappingPath, '..')
  // const entryFilename = getEntryFilename('local')
  // const innerFile = await codegen(mappingRoot, entryFilename, COMPILE_CODEGEN_LOCAL)
  zkGraphCache.copyDirToCacheDir(mappingPath)

  const [compileErr] = await to(ascCompileLocal('node_modules/.zkgraph/main_local.ts', wasmPath, watPath))
  if (compileErr)
    logger.error(`[-] COMPILATION ERROR. ${compileErr.message}`)
  zkGraphCache.clearCacheDir()
}

async function ascCompile(innerTsFilePath: string) {
  const commands = [
    'npx asc',
    innerTsFilePath,
    '-o', innerPrePrePath,
    '--runtime', 'stub',
    '--use', 'abort=node_modules/.zkgraph/common/type/abort',
    '--disable', 'bulk-memory',
    '--disable', 'mutable-globals',
    '--exportRuntime',
    '--exportStart', wasmStartName,
    '--memoryBase', '70000',
  ]
  return await execAndRmSync(commands.join(' '), innerTsFilePath)
}

async function ascCompileLocal(innerTsFilePath: string, wasmPath: string, watPath: string) {
  const commands = [
    'npx asc',
    innerTsFilePath,
    '-t', watPath,
    '-O', '--noAssert',
    '-o', wasmPath,
    '--runtime', 'stub',
    '--use', 'abort=node_modules/.zkgraph/common/type/abort',
    '--disable', 'bulk-memory',
    '--exportRuntime',
    '--exportStart', wasmStartName,
    '--memoryBase', '70000',
  ]
  return execAndRmSync(commands.join(' '), innerTsFilePath)
}

async function execAndRmSync(command: string, filepath: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      execSync(command)
      fs.rmSync(filepath)
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

// function getEntryFilename(env: string) {
//   return parseTemplateTag(COMPILE_TEMP_ENTRY_FILE_NAME_TEMPLATE, {
//     env,
//     salt: randomUniqueKey(10),
//   })
// }

// function getAbortTsFilepath(innerTsFilePath: string) {
//   return `${innerTsFilePath.replace(process.cwd(), '').substring(1).replace('.ts', '')}/abort`
// }
