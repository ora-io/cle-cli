import path from 'node:path'
import fs from 'node:fs'

export function createOnNonexist(filePath: string): void {
  const directoryPath = path.dirname(filePath)

  if (!fs.existsSync(directoryPath))
    fs.mkdirSync(directoryPath, { recursive: true })
}
