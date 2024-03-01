import { describe, expect, it } from 'vitest'
import { version } from '../package.json'
import { execCommand } from './utils/node'

const runCLI = 'node ./bin/cle.js'

describe('test CLI', () => {
  it('test run', () => {
    const runVersion = execCommand(`${runCLI} -v`)
    expect(runVersion).toContain(`cle/${version}`)
    const runHelper = execCommand(`${runCLI} -h`)
    expect(runHelper).toContain(`cle/${version}`)
    expect(runHelper).toContain('Usage')
    expect(runHelper).toContain('Commands')
    expect(runHelper).toContain('Options')
  })

  it.each([
    'compile',
    'exec',
    'prove',
    'setup',
    'upload',
    'verify',
    'publish',
  ])('test run %s', (command: string) => {
    const runCompile = execCommand(`${runCLI} ${command} -h`)
    expect(runCompile).toContain(`cle/${version}`)
    expect(runCompile).toContain('Usage')
    expect(runCompile).toContain('Options')
    expect(runCompile).toContain('Examples')
  })
})
