import { createConfigLoader } from 'unconfig'
import { DEFAULT_CONFIG, TAGS } from './constants'
import { parseTemplateTag } from './tag'
import type { LogLevel } from './logger'

export interface UserConfig {
  /**
   * Update your Etherum JSON RPC provider URL here.
   * Recommend using Erigon node RPC.
   */
  JsonRpcProviderUrl?: {
    mainnet?: string // Optional
    sepolia?: string // Optional
    goerli?: string // Optional
  }
  /**
   * Update your private key here to sign zkwasm messages.
   * Please note that (during testnet phrase) your address balance (in zkwasm server) should > 0;
   */
  UserPrivateKey?: string

  /**
   * @default "https://rpc.zkwasmhub.com:8090"
   */
  ZkwasmProviderUrl?: string
  /**
   * @default "http://compiler.dev.hyperoracle.io/compile"
   */
  CompilerServerEndpoint?: string
  /**
   * @default "https://api.pinata.cloud/pinning/pinFileToIPFS"
   */
  PinataEndpoint?: string
  PinataJWT?: string

  /**
   * @default "[root]/build/cle.wasm"
   */
  WasmBinPath?: string

  /**
   * @default "[root]/src/cle.yaml"
   */
  YamlPath?: string

  /**
   * @default "[root]/src/mapping.ts"
   */
  MappingPath?: string

  /**
   * @default "[root]/build/proof_[taskId].txt"
   */
  OutputProofFilePath?: string

  logger?: {
    /**
     * logger level
     * @default "info"
     */
    level?: LogLevel
  }
}

export type UserConfigFnObject = (...args: any[]) => UserConfig
export type UserConfigFnPromise = (...args: any[]) => Promise<UserConfig>
export type UserConfigFn = (...args: any[]) => UserConfig | Promise<UserConfig>
export type UserConfigExport = UserConfig | UserConfigFnObject | UserConfigFnPromise | Promise<UserConfig> | UserConfigFn

export function defineConfig(config: UserConfig): UserConfig
export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>
export function defineConfig(config: UserConfigFnObject): UserConfigFnObject
export function defineConfig(config: UserConfigFn): UserConfigFn
export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config
}

export async function loadConfigFromFile(configFile?: string, configRoot: string = process.cwd()) {
  async function rewrite(config: any) {
    const resolved = await (typeof config === 'function' ? config() : config)
    return resolved
  }

  const loader = await createConfigLoader<UserConfig>({
    cwd: configRoot,
    sources: [configFile
      ? {
          files: configFile || '',
          extensions: [],
          rewrite: rewrite as any,
        }
      : {
          files: 'cle.config',
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json'],
          rewrite: rewrite as any,
        }],
    defaults: DEFAULT_CONFIG,
  })
  const result = await loader.load()
  return result.config
}

export async function getConfig(configFile?: string, configRoot?: string) {
  const userConfig = await loadConfigFromFile(configFile, configRoot)

  userConfig.WasmBinPath = parseTemplateTag(userConfig.WasmBinPath || '', TAGS)
  // userConfig.LocalWasmBinPath = parseTemplateTag(userConfig.LocalWasmBinPath || '', TAGS)
  userConfig.YamlPath = parseTemplateTag(userConfig.YamlPath || '', TAGS)
  userConfig.MappingPath = parseTemplateTag(userConfig.MappingPath || '', TAGS)

  return userConfig as Required<UserConfig>
}
