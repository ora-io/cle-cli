import fs from 'node:fs'
import path from 'node:path'
import { getRelativePath } from './utils'
export class ZkGraphClass {
  cacheDir = path.join(process.cwd(), 'node_modules/.zkgraph')

  checkCacheDir() {
    if (fs.existsSync(this.cacheDir))
      fs.rmSync(this.cacheDir, { recursive: true })

    fs.mkdirSync(this.cacheDir, { recursive: true })
  }

  copyDirToCacheDir(mappingPath: string) {
    const sourcePath = path.join(process.cwd(), 'node_modules/@hyperoracle/zkgraph-lib')
    this.checkCacheDir()
    copyFolderRecursiveSync(sourcePath, this.cacheDir)
    this.rewriteReceive(mappingPath)
  }

  rewriteReceive(mappingPath: string) {
    const receiveFilePath = path.join(this.cacheDir, '/common/receive.ts')
    let content = fs.readFileSync(receiveFilePath, 'utf-8')
    const [,relative] = getRelativePath(mappingPath, receiveFilePath)
    content = `import { handleEvents } from "${relative}"
    ${content}`
    fs.writeFileSync(receiveFilePath, content)
  }

  clearCacheDir() {
    fs.rmSync(this.cacheDir, { recursive: true, force: true })
  }
}

function copyFolderRecursiveSync(source: string, target: string) {
  if (!fs.existsSync(source))
    return

  if (!fs.existsSync(target))
    fs.mkdirSync(target)

  const files = fs.readdirSync(source)

  files.forEach((file) => {
    const currentSource = path.join(source, file)
    const currentTarget = path.join(target, file)

    if (fs.statSync(currentSource).isDirectory())
      copyFolderRecursiveSync(currentSource, currentTarget)

    else
      fs.copyFileSync(currentSource, currentTarget)
  })
}

export const zkGraphCache = new ZkGraphClass()
