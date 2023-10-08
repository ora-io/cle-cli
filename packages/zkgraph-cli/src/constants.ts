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

  WasmBinPath: 'build/zkgraph_full.wasm',
  LocalWasmBinPath: 'build/zkgraph_local.wasm',
}
