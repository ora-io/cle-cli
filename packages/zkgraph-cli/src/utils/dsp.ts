// @ts-expect-error non-types
import { dspHub } from '@hyperoracle/zkgraph-api'
import { DspStaticParamsMap } from '../constants'

export function getDspHubParams() {
  const hubs = dspHub.hub as Map<string, {
    execParams: string[]
    proveParams: string[]
  }>

  return generateDspHubParamsMap(hubs)
}

export const DoNotIncludeParams = ['jsonRpcUrl']

export function generateDspHubParamsMap(hubs: Map<string, {
  execParams: string[]
  proveParams: string[]
}>) {
  const dspParamsMap: Record<
    string,
    {
      execParams?: string[]
      proveParams?: string[]
    }
  > = {}

  for (const key of hubs.keys()) {
    if (key.includes('local'))
      continue
    const hub = hubs.get(key)

    Reflect.set(dspParamsMap, key.replace(':full', ''), {
      execParams: hub?.execParams.filter(item => !DoNotIncludeParams.includes(item)),
      proveParams: hub?.proveParams.filter(item => !DoNotIncludeParams.includes(item)),
    })
  }

  return dspParamsMap
}

export function generateDspHubParams(dsp: any, params: string[], command: 'prove' | 'exec') {
  const dspProveParams = (dsp[DspStaticParamsMap[command]] as string[]).filter(param => !DoNotIncludeParams.includes(param))
  if (params.length !== dspProveParams.length) {
    // eslint-disable-next-line no-console
    console.log(`missing required args for command \`${command} ${dspProveParams.map(p => `<${p}>`).join(' ')}\``)
    return
  }
  const realParams = {}
  dspProveParams.forEach((param, index) => {
    Reflect.set(realParams, param, params[index])
  })
  return realParams
}
