import cac from 'cac'
import { version } from '../package.json'
import { compile } from './commands/compile'
import { exec } from './commands/exec'
import { setup } from './commands/setup'
import { prove as proveHandler } from './commands/prove'
import { deploy } from './commands/deploy'
import { upload } from './commands/upload'
import { verify } from './commands/verify'
import { publish } from './commands/publish'
import { getConfig } from './config'
import { createLogger, logger, setLogger } from './logger'
import { create } from './commands/create'
import { proveCLIHasModeOption } from './utils'

export async function run() {
  try {
    const cli = cac('zkgraph')
    const config = await getConfig()
    setLogger(createLogger(config.logger?.level || 'info'))

    cli
      .command('compile', 'Compile for Full Image (Link Compiled with Compiler Server)')
      .option('--local', 'Compile for Local Image')
      .option('--yaml-path <path>', 'Path to yaml file')
      .option('--mapping-path <path>', 'Path to mapping file')
      .example('zkgraph compile')
      .action((options) => {
        const { local = false, yamlPath = '', mappingPath = '' } = options
        const wasmPath = local ? config.LocalWasmBinPath : config.WasmBinPath

        compile({
          local,
          yamlPath: yamlPath || config.YamlPath,
          compilerServerEndpoint: config.CompilerServerEndpoint,
          wasmPath,
          watPath: wasmPath.replace(/\.wasm/, '.wat'),
          mappingPath: mappingPath || config.MappingPath,
        })
      })

    cli
      .command('exec <block id>', 'Execute Full Image')
      .option('--local', 'Execute Local Image')
      .example('zkgraph exec 0000000')
      .action((blockId, options) => {
        const { local = false } = options
        const wasmPath = local ? config.LocalWasmBinPath : config.WasmBinPath

        exec({
          local,
          blockId: Number(blockId),
          wasmPath,
          yamlPath: config.YamlPath,
          jsonRpcProviderUrl: config.JsonRpcProviderUrl,
        })
      })

    cli
      .command('setup', 'Set Up Full Image')
      .option('--local', 'Set Up Local Image')
      .option('-k, --circuit-size <size>', 'Circuit size (k in 2^k) of image')
      .example('zkgraph setup -k 20')
      .action((options) => {
        const { circuitSize = '', local = false } = options
        const wasmPath = local ? config.LocalWasmBinPath : config.WasmBinPath
        const size = !circuitSize || circuitSize === 0 ? local ? 20 : 22 : Number(circuitSize)
        setup({
          circuitSize: size,
          wasmPath,
          userPrivateKey: config.UserPrivateKey,
          zkWasmProviderUrl: config.ZkwasmProviderUrl,
        })
      })

    const proveCLI = cli
      .command('prove <block id> <expected state>', 'Prove Full Image')
      .option('--local', 'Prove Local Image')
      .option('-i, --inputgen', 'Run in input generation Mode')
      .option('-t, --test', 'Run in test Mode')
      .option('-p, --prove', 'Run in prove Mode')
      .example('zkgraph prove 0000000 0x00000000000000000000000000000000 -t')
      .example('zkgraph prove 0000000 0x00000000000000000000000000000000 -i')
      .example('zkgraph prove 0000000 0x00000000000000000000000000000000 -p')
      .action((blockId, expectedState, options) => {
        // eslint-disable-next-line prefer-const
        let { inputgen = false, test = false, prove = false, local = false } = options
        const hasMode = proveCLIHasModeOption()
        if (!hasMode)
          test = true

        if (!(inputgen || test || prove)) {
          logger.error('error: missing running mode (-i / -t / -p)\n')
          proveCLI.outputHelp()
          return
        }
        const wasmPath = local ? config.LocalWasmBinPath : config.WasmBinPath
        proveHandler({
          blockId: Number(blockId),
          expectedState,
          inputgen,
          test,
          prove,
          local,
          wasmPath,
          yamlPath: config.YamlPath,
          jsonRpcProviderUrl: config.JsonRpcProviderUrl,
          zkWasmProviderUrl: config.ZkwasmProviderUrl,
          userPrivateKey: config.UserPrivateKey,
          outputProofFilePath: config.OutputProofFilePath,
        })
      })

    proveCLI.usage('prove <block id> <expected state> -i|-t|-p')

    cli
      .command('deploy', 'Deploy Verification Contract for Full Image')
      .option('--local', 'Deploy Verification Contract for Local Image')
      .option('-n, --network-name <name>', 'Name of deployed network for verification contract (sepolia/goerli)')
      .example('zkgraph deploy -n sepolia')
      .action((options) => {
        const { networkName = '', local = false } = options
        const wasmPath = local ? config.LocalWasmBinPath : config.WasmBinPath
        deploy({
          local,
          network: networkName,
          wasmPath,
          yamlPath: config.YamlPath,
          zkWasmProviderUrl: config.ZkwasmProviderUrl,
          userPrivateKey: config.UserPrivateKey,
        })
      })

    cli
      .command('upload', 'Upload zkGraph (Code and Full Image)')
      .option('--local', 'Upload Local zkGraph (Code and Local Image)')
      .example('zkgraph upload')
      .action((options) => {
        const { local = false } = options
        upload({
          local,
          wasmPath: local ? config.LocalWasmBinPath : config.WasmBinPath,
          yamlPath: config.YamlPath,
          pinataEndpoint: config.PinataEndpoint,
          pinataJWT: config.PinataJWT,
          mappingPath: config.MappingPath,
          userPrivateKey: config.UserPrivateKey,
        })
      })

    cli
      .command('verify <prove task id>', 'Verify Proof Onchain')
      .example('zkgraph verify 000000')
      .action((taskId) => {
        verify({
          taskId,
          yamlPath: config.YamlPath,
          zkWasmProviderUrl: config.ZkwasmProviderUrl,
        })
      })

    cli
      .command('publish <deployed contract address> <ipfs_hash> <bounty_reward_per_trigger>', 'Publish and Register zkGraph Onchain')
      .example('zkgraph publish 0x00000000000000000000000000000000 0x00000000000000000000000000000000 100')
      .action((contractAddress, ipfsHash, bountyRewardPerTrigger) => {
        publish({ contractAddress, ipfsHash, bountyRewardPerTrigger, yamlPath: config.YamlPath, jsonRpcProviderUrl: config.JsonRpcProviderUrl, userPrivateKey: config.UserPrivateKey })
      })

    cli
      .command('init <target directory>', 'Init zkGraph template')
      .alias('create')
      .option('-t, --template <template>', 'Use template')
      .example('zkgraph init -t default')
      .action((directory, options) => {
        create(directory, options.template)
      })

    cli.help()
    cli.version(version)
    cli.parse()
  }
  catch (error) {
    errorHandler(error as Error)
  }
}

function errorHandler(error: Error): never {
  console.error(error.message)
  return process.exit(1)
}
