import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import to from 'await-to-js'
import FormData from 'form-data'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { codegen, createOnNonexist, fromHexString, loadZKGraphSources, parseYaml, randomUniqueKey } from '../utils'
import type { ZkGraphYaml } from '../types'
import { logger } from '../logger'
import { parseTemplateTag } from '../tag'
import { COMPILE_CODEGEN, COMPILE_CODEGEN_LOCAL, COMPILE_TEMP_ENTRY_FILE_NAME_TEMPLATE } from '../constants'

export interface CompileOptions {
  local: boolean
  yamlPath?: string
  compilerServerEndpoint: string
  wasmPath: string
  watPath: string
  mappingPath: string
  isUseAscLib?: boolean
}

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

  const mappingRoot = path.join(mappingPath, '..')
  const entryFilename = getEntryFilename('full')
  const innerFile = await codegen(mappingRoot, entryFilename, COMPILE_CODEGEN)

  const innerPrePrePath = path.join(path.dirname(wasmPath), '/temp/inner_pre_pre.wasm')
  createOnNonexist(innerPrePrePath)

  const [compileErr] = await to(ascCompile(path.join(mappingRoot, innerFile), innerPrePrePath))

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

  createOnNonexist(wasmPath)
  fs.writeFileSync(wasmPath, fromHexString(wasmModuleHex))

  createOnNonexist(watPath)
  fs.writeFileSync(watPath, wasmWat)

  // Log compiled file size by line count
  const compiledFileContent = fs.readFileSync(watPath, 'utf-8')
  const compiledFileLineCount = compiledFileContent.split('\n').length
  logger.info(`[*] ${compiledFileLineCount}${compiledFileLineCount > 1 ? 'lines' : 'line'}in ${watPath}`)
  // Log status
  logger.info(`[+] Output written to \`${path.dirname(wasmPath)}\` folder.`)
  logger.info('[+] COMPILATION SUCCESS!' + '\n')
}

async function compileLocal(options: CompileOptions) {
  const {
    wasmPath,
    watPath,
    mappingPath,
  } = options
  const mappingRoot = path.join(mappingPath, '..')
  const entryFilename = getEntryFilename('local')
  const innerFile = await codegen(mappingRoot, entryFilename, COMPILE_CODEGEN_LOCAL)

  const [compileErr] = await to(ascCompileLocal(path.join(mappingRoot, innerFile), wasmPath, watPath))
  if (compileErr) {
    logger.error(`[-] COMPILATION ERROR. ${compileErr.message}`)
    return
  }

  logger.info(`[+] Output written to \`${path.dirname(wasmPath)}\` folder.`)
  logger.info('[+] COMPILATION SUCCESS!' + '\n')
}

async function ascCompile(innerTsFilePath: string, innerPrePrePath: string) {
  const abortPath = getAbortTsFilepath(innerTsFilePath)

  let commands: string[] = [
    'npx asc',
  ]
  const common = [
    `-o ${innerPrePrePath}`,
    '--disable', 'bulk-memory',
    '--disable', 'mutable-globals',
    '--exportRuntime',
    '--exportStart', wasmStartName,
    '--memoryBase', '70000',
    '--runtime stub',
  ]
  commands = commands.concat([
    innerTsFilePath,
    '--use', `abort=${abortPath}`,
  ])
  commands = commands.concat(common)

  return await execAndRmSync(commands.join(' '), innerTsFilePath)
}

async function ascCompileLocal(innerTsFilePath: string, wasmPath: string, watPath: string) {
  const abortPath = getAbortTsFilepath(innerTsFilePath)
  let commands: string[] = [
    'npx asc',
  ]
  const common = [
    '-t', watPath,
    '-O', '--noAssert',
    '-o', wasmPath,
    '--runtime', 'stub',
    '--disable', 'bulk-memory',
    '--exportRuntime',
    '--exportStart', wasmStartName,
    '--memoryBase', '70000',
  ]
  commands = commands.concat([
    innerTsFilePath,
    '--use', `abort=${abortPath}`,
  ])
  commands = commands.concat(common)
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
// function copyDirAndCodegen(mappingPath: string) {
//   const mappingDir = path.dirname(mappingPath)

//   if (fs.existsSync(mappingDir)) {
//     zkGraphCache.copyDirToCacheDir(mappingDir)
//     const tsFils = getTsFiles(zkGraphCache.cacheDir)
//     // const libPath = path.join(process.cwd(), 'node_modules/@hyperoracle/zkgraph-lib')
//     for (const tsFile of tsFils) {
//       const rawCode = fs.readFileSync(tsFile, 'utf-8')
//       // const [relativePath] = getRelativePath(tsFile, libPath)
//       const transformCode = codegenImportReplace(rawCode, '~lib/@hyperoracle/zkgraph-lib')
//       fs.writeFileSync(tsFile, transformCode)
//     }
//     const codegenMappingPath = path.join(zkGraphCache.cacheDir, 'mapping.ts')
//     return codegenMappingPath
//   }
//   else {
//     logger.error(`[-] ${mappingDir} not exist.`)
//   }
// }

function getEntryFilename(env: string) {
  return parseTemplateTag(COMPILE_TEMP_ENTRY_FILE_NAME_TEMPLATE, {
    env,
    salt: randomUniqueKey(10),
  })
}

function getAbortTsFilepath(innerTsFilePath: string) {
  return `${innerTsFilePath.replace(process.cwd(), '').substring(1).replace('.ts', '')}/abort`.replaceAll('\\', '/')
}
