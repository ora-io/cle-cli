import type { providers } from 'ethers'
import { NETWORKS } from '../constants'
import { logDivider } from './log'

export function getTargetNetwork(inputtedNetworkName: string) {
  const validNetworkNames = NETWORKS.map(net => net.name.toLowerCase())
  if (!validNetworkNames.includes(inputtedNetworkName.toLowerCase())) {
    // eslint-disable-next-line no-console
    console.log(`[-] NETWORK NAME "${inputtedNetworkName}" IS INVALID.`, '\n')
    // eslint-disable-next-line no-console
    console.log(`[*] Valid networks: ${validNetworkNames.join(', ')}.`, '\n')
    logDivider()
    process.exit(1)
  }
  const targetNetwork = NETWORKS.find(
    net => net.name.toLowerCase() === inputtedNetworkName.toLowerCase(),
  )
  return targetNetwork
}

export async function validateProvider(ethersProvider: providers. JsonRpcProvider) {
  try {
    await ethersProvider.detectNetwork()
    Promise.resolve()
  }
  catch (err: any) {
    if (err.code === 'NETWORK_ERROR')
      Promise.reject(new Error('[-] could not detect network, please provide a valid provider in config file'))
    else
      Promise.reject(err)
  }
}
