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
