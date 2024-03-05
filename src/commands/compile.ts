import fs from 'node:fs'
import path from 'node:path'
import * as cleApi from '@ora-io/cle-api'
import webjson from '@ora-io/cle-lib/test/weblib/weblib.json'
import to from 'await-to-js'
import { CLEYaml } from '@ora-io/cle-api'
import { createOnNonexist, getFileContentsByFilePaths, getRelativePaths, getTsFileTreeByDir, isTsFile, loadMappingPathFromYaml } from '../utils'
import { logger } from '../logger'

export interface CompileOptions {
  yamlPath?: string
  dirPath?: string
  compilerServerEndpoint: string
  wasmPath: string
  watPath: string
}

export async function compile(options: CompileOptions) {
  const {
    wasmPath,
    watPath,
  } = options

  const succ = await compileRun(options)

  if (succ)
    logCompileResult(wasmPath, watPath)
}

async function compileRun(options: CompileOptions) {
  const {
    wasmPath,
    watPath,
  } = options

  let {
    yamlPath,
    dirPath,
  } = options

  if (dirPath) {
    if (!fs.existsSync(dirPath)) {
      // if dirPath is relative
      if (fs.existsSync(path.join(process.cwd(), dirPath)))
        dirPath = path.join(process.cwd(), dirPath)
    }
    const yamlPathInDir = path.join(dirPath, 'cle.yaml')
    if (fs.existsSync(yamlPathInDir))
      yamlPath = yamlPathInDir
  }

  if (!yamlPath) {
    logger.error('no yaml path provided')
    return false
  }
  const yaml = fs.readFileSync(yamlPath, 'utf8')
  const yamlMappingPath = loadMappingPathFromYaml(CLEYaml.fromYamlContent(yaml))
  if (!yamlMappingPath) {
    logger.error('[-] no mapping path provided in cle.yaml')
    return false
  }
  const mappingPath = path.join(path.dirname(yamlPath), yamlMappingPath)
  if (!isTsFile(mappingPath)) {
    logger.error('[-] mapping path provided in cle.yaml is not a ts file')
    return false
  }

  createOnNonexist(wasmPath)
  createOnNonexist(watPath)
  if (!dirPath)
    dirPath = path.dirname(mappingPath)
  const paths = getTsFileTreeByDir(dirPath)
  const relativePaths = getRelativePaths(dirPath, paths)
  const fileMap = getFileContentsByFilePaths(relativePaths, dirPath)

  const relativeYamlPath = path.relative(dirPath, yamlPath)
  const [err, res] = await to(cleApi.compile({
    ...webjson,
    ...fileMap,
    [relativeYamlPath]: yaml,
  }, {
    // isLocal: local,
    yamlPath: path.relative(path.dirname(mappingPath), yamlPath),
    outWasmPath: wasmPath,
    outWatPath: watPath,
    compilerServerEndpoint: options.compilerServerEndpoint,
  }))

  if (err) {
    logger.error(`[-] COMPILATION ERROR. ${err.message} ${(err as any).response?.data?.message || ''}`)
    return false
  }

  if (res?.error) {
    logger.error(`[-] COMPILATION ERROR. ${res.error?.message}`)
    logger.error(`[-] ${res.stderr?.toString()}`)
    return false
  }

  const outWasmHex = res?.outputs[wasmPath]
  const outWat = res?.outputs[watPath]
  fs.writeFileSync(wasmPath, outWasmHex)
  fs.writeFileSync(watPath, outWat)

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
