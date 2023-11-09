import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkPinataAuthentication, fromHexString, isEthereumAddress, loadZKGraphSources, parseYaml } from '../packages/zkgraph-cli/src/utils'
import type { ZkGraphYaml } from '../packages/zkgraph-cli/src/types'

describe('utils', () => {
  it('test loadYamlContent', async () => {
    const yamlPath = path.join(__dirname, 'fixtures/utils/test.yaml')
    const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
    const parser = await parseYaml(yamlContent)
    expect(parser.repository).toBe('https://github.com/hyperoracle/zkgraph')
    expect(parser.dataSources[0].source.address).toBe('0xa60ecf32309539dd84f27a9563754dca818b815e')
    expect(parser).toMatchSnapshot()
  })

  it('test isEthereumAddress', () => {
    expect(isEthereumAddress('0xa60ecf32309539dd84f27a9563754dca818b815e')).toBe(true)
    expect(isEthereumAddress('0x0000000000000000000000000000000000000001')).toBe(true)
    expect(isEthereumAddress('0x00000000000000000000000000000000000001')).toBe(false)
    expect(isEthereumAddress('0x0000000000000000000000000000000000000000')).toBe(false)
  })

  // it('test yamlHealthCheck', async () => {
  //   const yamlPath = path.join(__dirname, 'fixtures/utils/test-yaml-check.yaml')
  //   const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  //   const parser = await parseYaml(yamlContent)
  //   expect(() => yamlHealthCheck(parser)).not.toThrow()
  // })

  it('test loadZKGraphSources', async () => {
    const yamlPath = path.join(__dirname, 'fixtures/utils/test.yaml')
    const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
    const parser = await parseYaml<ZkGraphYaml>(yamlContent)
    const [source_address] = loadZKGraphSources(parser)
    expect(source_address).toEqual(parser.dataSources.map(item => item.source.address))
  })

  it('test fromHexString', () => {
    expect(fromHexString('0x0000000000000000000000000000000000000000')).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))
  })

  it('test checkPinataAuthentication', async () => {
    expect(await checkPinataAuthentication('')).toBeFalsy()
    expect(await checkPinataAuthentication('12132')).toBeFalsy()
  })
})
