import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getConfig, loadConfigFromFile } from '../packages/zkgraph-cli/src/config'

const configFixturesRoot = path.join(__dirname, 'fixtures/config')

describe('config', () => {
  it('load default config', async () => {
    const config = await loadConfigFromFile(undefined, configFixturesRoot)
    expect(config).toMatchSnapshot()
  })

  it('load function config', async () => {
    const funcConfigPath = 'zkgraph.func.config.ts'
    const config = await loadConfigFromFile(funcConfigPath, configFixturesRoot)
    expect(config).toMatchSnapshot()
  })

  it('merge config', async () => {
    const config = await getConfig('zkgraph.merge.config.ts', configFixturesRoot)
    expect(config).toMatchSnapshot()
  })
})
