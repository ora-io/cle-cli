import type { UserConfig } from './config'

export const DEFAULT_CONFIG: Required<UserConfig> = {
  JsonRpcProviderUrl: {
    mainnet: '',
    sepolia: '',
    goerli: '',
  },

  UserPrivateKey: '',

  ZkwasmProviderUrl: 'https://zkwasm-explorer.delphinuslab.com:8090',
  CompilerServerEndpoint: 'http://compiler.hyperoracle.io/compile',
  PinataEndpoint: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
  PinataJWT: '',

  WasmBinPath: '[root]/build/zkgraph_full.wasm',
  LocalWasmBinPath: '[root]/build/zkgraph_local.wasm',
}

export const TAGS = {
  root: process.cwd(),
}
