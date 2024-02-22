import type { UserConfig } from './config'

export const DEFAULT_CONFIG: Required<UserConfig> = {
  JsonRpcProviderUrl: {
    mainnet: 'https://rpc.ankr.com/eth',
    sepolia: 'https://rpc.ankr.com/eth_sepolia',
    goerli: '',
  },

  UserPrivateKey: '',

  ZkwasmProviderUrl: 'https://rpc.zkwasmhub.com:8090',
  CompilerServerEndpoint: 'http://compiler.hyperoracle.io/compile',
  PinataEndpoint: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
  PinataJWT: '',

  WasmBinPath: '[root]/build/cle.wasm',

  YamlPath: '[root]/src/cle.yaml',

  OutputProofFilePath: '[root]/build/proof_[taskId].txt',

  logger: {
    level: 'info',
  },
}

export const TAGS = {
  root: process.cwd(),
}

export const NETWORKS = [
  {
    name: 'Sepolia',
    label: 'Sepolia',
    value: 11155111,
    expectedEth: 0.002,
    hex: '0xaa36a7',
  },
  {
    name: 'Goerli',
    label: 'Goerli',
    value: 5,
    expectedEth: 0.5,
    hex: '0x5',
  },
  {
    name: 'Mainnet',
    label: 'Mainnet',
    value: 1,
  },
]

export const TdConfig = {
  fee: '0.005',
  contract: '0x47C7FC91bf15b2Af9075f55Ae0F57ce18b1328B3',
  queryrApi: 'https://zkwasm.hyperoracle.io/td',
  providerUrl: 'https://ethereum-sepolia.publicnode.com',
}

export const AggregatorVerifierAddress = {
  mainnet: 'not support yet',
  sepolia: '0x714C66711F6552D4F388Ec79D4A33FE20173cC34',
  goerli: '0x5e6ca2dd26eA8F9A17aEc6e35a8dcD7C5B12FcDF',
}

export const DspStaticParamsMap = {
  prove: 'proveParams',
  exec: 'execParams',
}
