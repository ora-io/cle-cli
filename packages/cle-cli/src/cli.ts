import cac from 'cac'
import { version } from '../package.json'
import { compile } from './commands/compile'
import { exec } from './commands/exec'
import { setup } from './commands/setup'
import { prove as proveHandler } from './commands/prove'
import { upload } from './commands/upload'
import { verify } from './commands/verify'
import { publish } from './commands/publish'
import { getConfig } from './config'
import { logger, setLogger } from './logger'
import { create } from './commands/create'
import { generateCommandUsage, proveCLIHasModeOption } from './utils'
import { deposit } from './commands/deposit'

export async function run() {
  try {
    const cli = cac('cle')

    const config = await getConfig()
    setLogger(logger)

    const { proveUsage, execUsage } = generateCommandUsage()
    cli
      .command('compile', 'Compile for Full Image (Link Compiled with Compiler Server)')
      .option('--local', 'Compile for Local Image')
      .option('--yaml-path <path>', 'Path to yaml file')
      .option('--mapping-path <path>', 'Path to mapping file')
      .example('cle compile')
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
      .command('exec [...params]', 'Execute Full Image')
      .option('--local', 'Execute Local Image')
      .example('cle exec 0000000')
      .action((params, options) => {
        const { local = false } = options
        const wasmPath = local ? config.LocalWasmBinPath : config.WasmBinPath

        exec({
          local,
          wasmPath,
          yamlPath: config.YamlPath,
          jsonRpcProviderUrl: config.JsonRpcProviderUrl,
          params,
        })
      })
      .usage(`[...params]

Usage cases:
  ${execUsage}`)

    cli
      .command('setup', 'Set Up Full Image')
      .option('--local', 'Set Up Local Image')
      .option('-k, --circuit-size <size>', 'Circuit size (k in 2^k) of image')
      .example('cle setup -k 20')
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
      .command('prove [...params]', 'Prove Full Image')
      .option('--local', 'Prove Local Image')
      .option('-i, --inputgen', 'Run in input generation Mode')
      .option('-t, --test', 'Run in test Mode')
      .option('-p, --prove', 'Run in prove Mode')
      .example('cle prove 2279547 a60ecf32309539dd84f27a9563754dca818b815e -t')
      .example('cle prove 2279547 a60ecf32309539dd84f27a9563754dca818b815e -i')
      .example('cle prove 2279547 a60ecf32309539dd84f27a9563754dca818b815e -p')
      .action((params, options) => {
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
          params,
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
      .usage(`[...params]

Usage cases:
  ${proveUsage}`)

    cli
      .command('upload', 'Upload CLE (Code and Full Image)')
      .option('--local', 'Upload Local CLE (Code and Local Image)')
      .example('cle upload')
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
      .example('cle verify 000000')
      .action((taskId) => {
        verify({
          taskId,
          yamlPath: config.YamlPath,
          zkWasmProviderUrl: config.ZkwasmProviderUrl,
          jsonRpcProviderUrl: config.JsonRpcProviderUrl,
        })
      })

    cli
      .command('publish <ipfs_hash> [bounty_reward_per_trigger]', 'Publish and Register CLE Onchain')
      .example('cle publish 0x00000000000000000000000000000000 0')
      .usage(`publish <ipfs_hash> [bounty_reward_per_trigger]

    ipfs_hash: by finishing upload get it
      `)
      .action((ipfsHash, bountyRewardPerTrigger) => {
        publish({
          ipfsHash,
          bountyRewardPerTrigger: bountyRewardPerTrigger || 0,
          yamlPath: config.YamlPath,
          wasmPath: config.WasmBinPath,
          jsonRpcProviderUrl: config.JsonRpcProviderUrl,
          userPrivateKey: config.UserPrivateKey,
          zkWasmProviderUrl: config.ZkwasmProviderUrl,
        })
      })

    cli
      .command('init <target directory>', 'Init CLE template')
      .alias('create')
      .option('-t, --template <template>', 'Use template')
      .example('cle init -t default')
      .action((directory, options) => {
        create(directory, options.template)
      })

    cli
      .command('deposit <deployed contract address> <deposit amount>', 'Publish and register CLE onchain.')
      .example('cle deposit 0x00000000000000000000000000000000 0.1')
      .action((deployedContractAddress, depositAmount) => {
        deposit({
          jsonRpcProviderUrl: config.JsonRpcProviderUrl,
          deployedContractAddress,
          depositAmount,
          userPrivateKey: config.UserPrivateKey,
          yamlPath: config.YamlPath,
        })
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
