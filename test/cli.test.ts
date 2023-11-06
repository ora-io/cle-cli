import { describe, expect, it } from 'vitest'
import { version } from '../package.json'
import { execCommand } from './utils/node'

const runCLI = 'node ./packages/zkgraph-cli/dist/bin/zkgraph.js'

describe('test CLI', () => {
  it('test run', () => {
    const runVersion = execCommand(`${runCLI} -v`)
    expect(runVersion).toContain(`zkgraph/${version}`)
    const runHelper = execCommand(`${runCLI} -h`)
    expect(runHelper).toContain(`zkgraph/${version}`)
    expect(runHelper).toContain('Usage')
    expect(runHelper).toContain('Commands')
    expect(runHelper).toContain('Options')
  })

  it.each([
    'compile',
    'exec',
    'prove',
    'deploy',
    'setup',
    'upload',
    'verify',
    'publish',
  ])('test run compile', (command: string) => {
    const runCompile = execCommand(`${runCLI} ${command} -h`)
    expect(runCompile).toContain(`zkgraph/${version}`)
    expect(runCompile).toContain('Usage')
    expect(runCompile).toContain('Options')
    expect(runCompile).toContain('Examples')
  })
})
