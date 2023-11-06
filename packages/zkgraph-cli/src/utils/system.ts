import { execSync } from 'node:child_process'

export function checkExecExist(command: string) {
  try {
    execSync(command, { stdio: 'ignore' })
    return true
  }
  catch (error) {
    return false
  }
}
