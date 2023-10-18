import { execSync } from 'node:child_process'
import path from 'node:path'
import consola from 'consola'
import fs, { readJSONSync } from 'fs-extra'
import fg from 'fast-glob'
import { haveWorkspacePackages } from './constants'

const { version } = readJSONSync('package.json')

const rootDir = path.resolve(__dirname, '..')
const DIRS_COPY_ROOT = ['bin']

const FILES_COPY_LOCAL = [
  'README.md',
]

const FILES_COPY_DIST = [
  '*.cjs',
  '*.mjs',
  '*.d.ts',
]

async function build() {
  if (process.platform !== 'win32') {
    consola.info('Clean up')
    execSync('pnpm run clean', { stdio: 'inherit' })
  }

  consola.info('Create zkGraph build')
  execSync('pnpm run -C packages/create-zkgraph build', { stdio: 'inherit' })

  consola.info('CLI build')
  execSync('pnpm run -C packages/zkgraph-cli build', { stdio: 'inherit' })

  buildMetaFiles()
}

async function buildMetaFiles() {
  for (const name of haveWorkspacePackages) {
    const packageRoot = path.resolve(rootDir, 'packages', name)
    const packageDist = path.resolve(packageRoot, 'dist')

    await fs.copyFile(path.join(rootDir, 'README.md'), path.join(packageDist, 'README.md'))

    for (const dir of DIRS_COPY_ROOT)
      await fs.copy(path.join(packageRoot, dir), path.join(packageDist, dir))

    const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })

    for (const file of files)
      await fs.copyFile(path.join(packageRoot, file), path.join(packageDist, file))

    const distFiles = await fg(FILES_COPY_DIST, { cwd: packageDist })
    const distDir = path.join(packageDist, 'dist')
    if (!await fs.pathExists(distDir))
      await fs.mkdirp(distDir)

    for (const file of distFiles) {
      const oldFilePath = path.join(packageDist, file)
      await fs.copyFile(oldFilePath, path.join(distDir, file))
      await fs.remove(oldFilePath)
    }

    const packageJSON = await fs.readJSON(path.join(packageRoot, 'package.json'))
    for (const key of Object.keys(packageJSON.dependencies || {})) {
      if (haveWorkspacePackages.includes(key))
        packageJSON.dependencies[key] = version
    }
    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, { spaces: 2 })
  }
}

build()
