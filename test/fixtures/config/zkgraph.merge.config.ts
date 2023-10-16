import { defineConfig } from '../../../packages/zkgraph-cli/src/config'

export default defineConfig({
  JsonRpcProviderUrl: {
    mainnet: 'https://eth-mainnet.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6', // Optional
    sepolia: 'https://rpc.ankr.com/eth_sepolia', // Optional
    goerli: 'https://eth-goerli.nodereal.io/v1/5c1f0a30d6ff4093a31afce579bca8d6', // Optional
  },
  PinataJWT: 'PinataJWT',
  UserPrivateKey: 'UserPrivateKey',
  WasmBinPath: 'WasmBinPath',
})
