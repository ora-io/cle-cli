import { execSync } from 'node:child_process'

export function execCommand(command: string) {
  try {
    const res = execSync(command)
    return res.toString()
  }
  catch (error: any) {
    throw new Error(error.message)
  }
}
