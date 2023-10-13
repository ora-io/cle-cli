import path from 'node:path'
import fs from 'node:fs'
export async function codegen(mappingRoot: string, filename: string, content: string) {
  return new Promise<string>((resolve, reject) => {
    try {
      const filepath = path.join(mappingRoot, filename)
      fs.writeFileSync(filepath, content, 'utf-8')
      resolve(filename)
    }
    catch (error) {
      reject(error)
    }
  })
}

