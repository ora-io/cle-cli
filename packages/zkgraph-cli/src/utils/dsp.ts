// @ts-expect-error non-types
import { dspHub } from '@hyperoracle/zkgraph-api'
import { DspStaticParamsMap } from '../constants'

export function getDspHubParams() {
  const hub = dspHub.hub as Map<string, {
    execParams: string[]
    proveParams: string[]
  }>

  return generateDspHubParamsMap(hub)
}

export const DoNotIncludeParams = ['jsonRpcUrl']

export function generateDspHubParamsMap(hub: Map<string, {
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

  for (const dspName of hub.keys()) {
    if (dspName.includes(':local'))
      continue
    const dsp = hub.get(dspName)

    Reflect.set(dspParamsMap, dspName.replace(':full', ''), {
      execParams: dsp?.execParams.filter(item => !DoNotIncludeParams.includes(item)),
      proveParams: dsp?.proveParams.filter(item => !DoNotIncludeParams.includes(item)),
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
  const realParams: Record<string, any> = {}
  dspProveParams.forEach((param, index) => {
    Reflect.set(realParams, param, params[index])
  })
  return realParams
}
