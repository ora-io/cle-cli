import path from 'node:path'
import fs from 'node:fs'

export const getRelativePath = (a: string, b: string) => {
  const relativePath1 = path.relative(path.dirname(a), b)
  const relativePath2 = path.relative(path.dirname(b), a)

  return [relativePath1, relativePath2]
}

export function createOnNonexist(filePath: string): void {
  const directoryPath = path.dirname(filePath)

  if (!fs.existsSync(directoryPath))
    fs.mkdirSync(directoryPath, { recursive: true })
}
