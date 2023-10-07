import { execSync } from 'node:child_process'
import consola from 'consola'

async function build() {
  if (process.platform !== 'win32') {
    consola.info('Clean up')
    execSync('pnpm run clean', { stdio: 'inherit' })
  }

  consola.info('CLI build')
  execSync('pnpm run -C packages/zkgraph-cli build', { stdio: 'inherit' })

  consola.info('Create zkGraph build')
  execSync('pnpm run -C packages/create-zkgraph build', { stdio: 'inherit' })
}

build()
