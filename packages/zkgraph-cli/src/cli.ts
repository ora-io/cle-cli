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
      .action((options) => {
        const { circuitSize = '', local = false } = options
        setup(circuitSize, local)
      })

    const proveCLI = cli
      .command('prove <block id> <expected state>', 'Prove Full Image')
      .option('--local', 'Prove Local Image')
      .option('-i, --inputgen', 'Run in input generation Mode')
      .option('-t, --test', 'Run in test Mode')
      .option('-p, --prove', 'Run in prove Mode')
      .action((blockId, expectedState, options) => {
        const { inputgen = false, test = false, prove = false, local = false } = options
        if (!(inputgen || test || prove)) {
          logger.error('error: missing running mode (-i / -t / -p)\n')
          proveCLI.outputHelp()
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

    cli
      .command('deploy', 'Deploy Verification Contract for Full Image')
      .option('--local', 'Deploy Verification Contract for Local Image')
      .option('-n, --network-name <name>', 'Name of deployed network for verification contract (sepolia/goerli)')
      .action((options) => {
        const { networkName = '', local = false } = options
        deploy(networkName, local)
      })

    cli
      .command('upload', 'Upload zkGraph (Code and Full Image)')
      .option('--local', 'Upload Local zkGraph (Code and Local Image)')
      .action((options) => {
        const { local = false } = options
        upload(local)
      })

    cli
      .command('verify <prove task id>', 'Verify Proof Onchain')
      .action((taskId) => {
        verify(taskId)
      })

    cli
      .command('publish <deployed contract address> <ipfs_hash> <bounty_reward_per_trigger>', 'Publish and Register zkGraph Onchain')
      .action((contractAddress, ipfsHash, bountyRewardPerTrigger) => {
        publish(contractAddress, ipfsHash, bountyRewardPerTrigger)
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
