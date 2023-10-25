import { execSync } from 'node:child_process'
import path from 'node:path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { packages } from './constants'
const { version: oldVersion } = fs.readJSONSync('package.json')

const rootDir = path.resolve(__dirname, '..')

execSync('bumpp --no-commit --no-tag --no-push', { stdio: 'inherit' })

const { version } = fs.readJSONSync('package.json')

if (oldVersion === version) {
  console.log('canceled')
  process.exit()
}

async function release() {
  for (const name of packages) {
    const packageRoot = path.resolve(rootDir, 'packages', name)
    const packageJSON = await fs.readJSON(path.join(packageRoot, 'package.json'))
    packageJSON.version = version
    await fs.writeJSON(path.join(packageRoot, 'package.json'), packageJSON, { spaces: 2 })
  }

  await updateTemplateVersion()

  execSync('npm run build', { stdio: 'inherit' })
  execSync('git add .', { stdio: 'inherit' })

  execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' })
  execSync(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit' })

  execSync('git push', { stdio: 'inherit' })
  execSync('git push --tags', { stdio: 'inherit' })
}

async function updateTemplateVersion() {
  const createZkGraphPath = path.resolve(rootDir, 'packages', 'create-zkgraph')
  const dirs = await fg('template-*', { cwd: createZkGraphPath, onlyDirectories: true, markDirectories: true })

  for (const dir of dirs) {
    const packageJSON = await fs.readJSON(path.join(createZkGraphPath, dir, 'package.json'))
    if (Reflect.has(packageJSON.devDependencies, '@hyperoracle/zkgraph-cli'))
      packageJSON.devDependencies['@hyperoracle/zkgraph-cli'] = version
    else if (Reflect.has(packageJSON.dependencies, '@hyperoracle/zkgraph-cli'))
      packageJSON.dependencies['@hyperoracle/zkgraph-cli'] = version
    await fs.writeJSON(path.join(createZkGraphPath, dir, 'package.json'), packageJSON, { spaces: 2 })
  }
}

release()
