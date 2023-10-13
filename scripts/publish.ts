import { execSync } from 'node:child_process'
import path from 'node:path'
import { consola } from 'consola'
import { version } from '../package.json'
import { packages } from './constants'

let command = 'npm publish --access public'

if (version.includes('beta'))
  command += ' --tag beta'
else if (version.includes('alpha'))
  command += ' --tag alpha'

for (const name of packages) {
  execSync(command, { stdio: 'inherit', cwd: path.join('packages', name) })
  consola.success(`Published zkGraph ${name}`)
}
