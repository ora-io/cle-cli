import path from 'node:path'
import fs from 'node:fs'

export function getTsFiles(dir: string): string[] {
  const filePaths: string[] = []
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    if (isTsFile(dir))
      filePaths.push(dir)
    return filePaths
  }

  const fileAndDirs = fs.readdirSync(dir)
  for (const file of fileAndDirs) {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      const paths = getTsFiles(filePath)
      filePaths.push(...paths)
    }
    else if (isTsFile(file)) { filePaths.push(filePath) }
  }

  return [
    ...filePaths,
  ]
}

export function isTsFile(file: string): boolean {
  return path.extname(file) === '.ts'
}

export function getTsFileTreeByDir(dir: string) {
  const fileTree: string[] = []
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      const subFiles = getTsFileTreeByDir(filePath)
      fileTree.push(...subFiles)
    }
    else if (isTsFile(file)) {
      fileTree.push(filePath)
    }
  }
  return fileTree
}

export function getRelativePaths(dir: string, filePaths: string[]): string[] {
  const relativePaths: string[] = []
  for (const filePath of filePaths) {
    const relativePath = path.relative(dir, filePath)
    relativePaths.push(relativePath)
  }
  return relativePaths
}

export function getFileContentsByFilePaths(filePaths: string[], basePath: string) {
  const fileContents: Record<string, string> = {}
  for (const filePath of filePaths) {
    const fileContent = fs.readFileSync(path.join(basePath, filePath), 'utf-8')
    Reflect.set(fileContents, filePath, fileContent)
  }
  return fileContents
}

