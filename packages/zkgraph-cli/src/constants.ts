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

  YamlPath: '[root]/src/zkgraph.yaml',
  MappingPath: '[root]/src/mapping.ts',

  logger: {
    level: 'info',
  },
}

export const TAGS = {
  root: process.cwd(),
}

export const COMPILE_TEMP_ENTRY_FILE_NAME_TEMPLATE = 'entry_[salt].[env].ts'

export const COMPILE_CODEGEN = `
import { inner_real } from "@hyperoracle/zkgraph-lib"
export { asmain } from "@hyperoracle/zkgraph-lib"
import { handleEvents } from "./mapping"

export function inner(
  raw_receipts_ptr: usize,
  match_event_cnt: i32,
  matched_event_offsets_ptr: usize,
  re_state_len: usize,
): usize {
  return inner_real(
    raw_receipts_ptr, 
    match_event_cnt, 
    matched_event_offsets_ptr,
    re_state_len
  )
}
function abort(a: usize, b: usize, c: u32, d: u32): void {}
`
export const COMPILE_CODEGEN_LOCAL = `
export { asmain, zkmain } from "@hyperoracle/zkgraph-lib"
import { registerHandle } from "@hyperoracle/zkgraph-lib"
import { handleEvents } from "./mapping"
export function local_run(): void {
  registerHandle(handleEvents)
}
function abort(a: usize, b: usize, c: u32, d: u32): void {}
`
