import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getConfig, loadConfigFromFile } from '../src/config'

const configFixturesRoot = path.join(__dirname, 'fixtures/config')

describe('config', () => {
  it('load default config', async () => {
    const config = await loadConfigFromFile(undefined, configFixturesRoot)
    expect(config).toMatchSnapshot()
  })

  it('load function config', async () => {
    const funcConfigPath = 'cle.func.config.ts'
    const config = await loadConfigFromFile(funcConfigPath, configFixturesRoot)
    expect(config).toMatchSnapshot()
  })

  it('merge config', async () => {
    const config = await getConfig('cle.merge.config.ts', configFixturesRoot) as any
    // its value will change at runtime
    // so in order to pass the test correctly
    // delete it.
    delete config.LocalWasmBinPath
    delete config.YamlPath
    delete config.MappingPath
    expect(config).toMatchSnapshot()
  })

  it('load object config', async () => {
    const funcConfigPath = 'cle.object.config.ts'
    const config = await loadConfigFromFile(funcConfigPath, configFixturesRoot)
    expect(config).toMatchSnapshot()
  })
})
