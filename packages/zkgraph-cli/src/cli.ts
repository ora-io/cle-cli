import cac from 'cac'
import { version } from '../package.json'
import { compile } from './compile'
import { exec } from './exec'
import { setup } from './setup'
import { prove as proveHandler } from './prove'
import { deploy } from './deploy'
import { upload } from './upload'
import { verify } from './verify'
import { publish } from './publish'

export function run() {
  try {
    const cli = cac('zkgraph')

    cli
      .command('compile', 'Compile for Full Image (Link Compiled with Compiler Server)')
      .option('--local', 'Compile for Local Image')
      .action((options) => {
        const { local = false } = options
        compile(local)
      })

    cli
      .command('exec <block id>', 'Execute Full Image')
      .option('--local', 'Execute Local Image')
      .action((blockId, options) => {
        const { local = false } = options
        exec(blockId, local)
      })

    cli
      .command('setup', 'Set Up Full Image')
      .option('--local', 'Set Up Local Image')
      .option('-k, --circuit-size <size>', 'Circuit size (k in 2^k) of image')
      .action((options) => {
        const { circuitSize = '', local = false } = options
        setup(circuitSize, local)
      })

    cli
      .command('prove <block id> <expected state>', 'Prove Full Image')
      .option('--local', 'Prove Local Image')
      .option('-i, --inputgen', 'Run in input generation Mode')
      .option('-t, --test', 'Run in test Mode')
      .option('-p, --prove', 'Run in prove Mode')
      .action((blockId, expectedState, options) => {
        const { inputgen = false, test = false, prove = false, local = false } = options
        proveHandler(blockId, expectedState, inputgen, test, prove, local)
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
