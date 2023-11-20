import { DspStaticParamsMap } from '../constants'
import { getDspHubParams } from './dsp'

export function proveCLIHasModeOption() {
  const proveModeOptions = ['-i', '-t', '-p', '--inputgen', '--test', '--prove']
  const argv = process.argv
  if (!argv.length)
    return false

  const command = argv[2]
  if (command === 'prove') {
    for (let i = 3; i < argv.length; i++) {
      if (proveModeOptions.includes(argv[i]))
        return true
    }
  }
  return false
}

export function generateCommandUsage() {
  const dspParams = getDspHubParams()

  function generateUsage(command: 'prove' | 'exec') {
    const staticParams = DspStaticParamsMap[command]
    return Object.keys(dspParams).map((paramsName, index) => {
      const params = ((dspParams[paramsName] as any)[staticParams] as string[])?.map(param => `<${param}>`).join(' ')
      return `${index > 0 ? '    ' : ''}Usage ${paramsName}: 
        ${`$ zkgraph ${command} ${params}`.trimStart().trimEnd()}`
    }).join('\n')
  }

  return {
    proveUsage: generateUsage('prove'),
    execUsage: generateUsage('exec'),
  }
}
