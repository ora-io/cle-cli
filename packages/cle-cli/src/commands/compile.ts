import fs from 'node:fs'
import path from 'node:path'
import * as zkgapi from '@hyperoracle/cle-api-test'
import webjson from '@hyperoracle/cle-lib-test/test/weblib/weblib.json'
import to from 'await-to-js'
import { isTsFile } from '../utils'
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
  } = options

  const succ = await compileBasic(options)

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

  const paths = getFileTreeByDir(path.dirname(mappingPath))
  const relativePaths = getRelativePaths(path.dirname(mappingPath), paths)
  const fileMap = getFileContentsByFilePaths(relativePaths, path.dirname(mappingPath))

  const relativeYamlPath = path.relative(path.dirname(mappingPath), yamlPath)
  const yaml = fs.readFileSync(yamlPath, 'utf8')

  const [err, res] = await to(zkgapi.compile({
    ...webjson,
    ...fileMap,
    [relativeYamlPath]: yaml,
  }, {
    isLocal: local,
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

function getFileTreeByDir(dir: string) {
  const fileTree: string[] = []
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      const subFiles = getFileTreeByDir(filePath)
      fileTree.push(...subFiles)
    }
    else if (isTsFile(file)) {
      fileTree.push(filePath)
    }
  }
  return fileTree
}

function getRelativePaths(dir: string, filePaths: string[]): string[] {
  const relativePaths: string[] = []
  for (const filePath of filePaths) {
    const relativePath = path.relative(dir, filePath)
    relativePaths.push(relativePath)
  }
  return relativePaths
}

function getFileContentsByFilePaths(filePaths: string[], basePath: string) {
  const fileContents: Record<string, string> = {}
  for (const filePath of filePaths) {
    const fileContent = fs.readFileSync(path.join(basePath, filePath), 'utf-8')
    Reflect.set(fileContents, filePath, fileContent)
  }
  return fileContents
}
