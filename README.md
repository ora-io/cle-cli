
<p align="center">
  <a href="https://www.ora.io" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://github.com/ora-io/media-kit/blob/main/Logos/logo%20type_blue_V1.png?raw=true" alt="ORA logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/@ora-io/cle-cli"><img src="https://img.shields.io/npm/v/@ora-io/cle-cli/latest.svg" alt="npm package"></a>
  <a href="https://github.com/ora-io/cle-cli/actions/workflows/ci.yml"><img src="https://github.com/ora-io/cle-cli/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://www.npmjs.com/package/@ora-io/cle-lib"><img alt="npm peer dependency version (scoped)" src="https://img.shields.io/npm/dependency-version/%ora-io%2Fcle-cli/peer/%ora-io%2Fcle-lib"></a>
</p>
<br/>

# CLE CLI

## Getting Started

### Scaffolding Your First CLE Project

With NPM:
```bash
npm create cle@latest
```

With Yarn:

```bash
yarn create cle@latest
```

With PNPM:

```bash
pnpm create cle@latest
```

Then follow the prompts!

To scaffold a **uniswapprice** template, you can directly specify the project name and the desired template using additional command line options. For instance, you can run the following command:

```sh
# npm 6.x
npm create cle@latest my-cle-uniswapprice --template uniswapprice

# npm 7+, extra double-dash is needed:
npm create cle@latest my-cle-uniswapprice -- --template uniswapprice

# yarn
yarn create cle@latest my-cle-uniswapprice --template uniswapprice

# pnpm
pnpm create cle@latest my-cle-uniswapprice --template uniswapprice
```

## CLI

> Note: Only `full` image will be processed by zkOracle node. `unsafe` (define `unsafe: true` in the `cle.yaml`) means the CLE is compiled locally and only contains partial computation (so that proving and executing will be faster).

The workflow of local CLE development must follow: `Develop` (code in /src) -> `Compile` (get compiled wasm image) -> `Execute` (get expected output) -> `Prove` (generate input and pre-test for actual proving in zkOracle) -> `Verify` (verify proof on-chain).

To upload and publish your CLE, you should `Upload` (upload code to IPFS), and then `Publish` (register CLE on onchain CLE Registry).

### Compile

Compile for Full Image (Link Compiled with Compiler Server).

#### Usage

```bash
cle compile [root]
```

#### Options

| Options              | Description                           |
| -------------------- | ------------------------------------- |
| `--yaml-path <path>` | Path to yaml file                     |
| `--dir <path>`       | Path to directory containing cle.yaml |

### Execute

Execute Full Image.

Please save the `CLE_STATE_OUTPUT` string for following prove steps.

#### Usage
```bash
cle exec [...params] [root]
```

#### Usage cases
```bash
cle exec <blockId> [root]
cle exec <blockId> <offchainData> [root]
```


#### Arguments

| Arguments        | Description                                     |
| ---------------- | ----------------------------------------------- |
| `<block id>`     | Block number (or block hash) as runtime context |
| `<offchainData>` | offchain data                                   |


### Set Up

Set Up Full Image

- `circuit-size`: Specify the circuit size of image instead of the default recommended. eg. `cle setup -- --circuit-size <size> (eg. 22)`.

#### Usage
```bash
cle setup [root]
```

#### Options

| Options                     | Description                      |
| --------------------------- | -------------------------------- |
| `-k, --circuit-size <size>` | Circuit size (k in 2^k) of image |

### Prove

Prove Full Image

#### Usage
```bash
cle prove [...params] [root]
```

#### Usage cases
```bash
cle prove <blockId> <expectedStateStr> [root]
cle prove <blockId> <offchainData> <expectedStateStr> [root]
```

#### Arguments

| Arguments          | Description                                     |
| ------------------ | ----------------------------------------------- |
| `<block id>`       | Block number (or block hash) as runtime context |
| `<expected state>` | State output of the CLE execution               |
| `<offchainData>`   | offchain data                                   |


#### Options

| Options          | Description                  |
| ---------------- | ---------------------------- |
| `-i, --inputgen` | Run in input generation Mode |
| `-t, --test`     | Run in test Mode             |
| `-p, --prove`    | Run in prove Mode            |

### Upload

Upload CLE (Code and Full Image).

Please save the `ipfs_hash` from the output dialog for following publish steps.

#### Usage
```bash
cle upload [root]
```


### Verify

Verify Proof Onchain.

#### Usage
```bash
cle verify <prove task id>
```

#### Arguments

| Arguments         | Description           |
| ----------------- | --------------------- |
| `<prove task id>` | Task id of prove task |


### Publish

Publish and Register CLE Onchain.

See also: [Verifier Contract Interface](https://github.com/DelphinusLab/halo2aggregator-s/blob/main/sol/contracts/AggregatorVerifier.sol#L40).

#### Usage
```bash
cle publish <ipfs_hash> [bounty_reward_per_trigger]
```

#### Arguments

| Arguments                     | Description                      |
| ----------------------------- | -------------------------------- |
| `<ipfs hash>`                 | IPFS hash of uploaded CLE        |
| `[bounty reward per trigger]` | Bounty reward per trigger in ETH |

### Deposit

Publish and register CLE Onchain.

#### Usage
```bash
cle deposit <deployed contract address> <deposit amount>
```

#### Arguments

| Arguments                     | Description                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `<deployed contract address>` | Contract address of deployed verification contract address |
| `<deposit amount>`            | Deposit amount in ETH                                      |

## Config

### Configuring CLE

When running CLE from the command line, the tool will automatically attempt to locate a configuration file named cle.config.js in the project’s root directory. It also supports other file extensions such as JS and TS.

The most basic config file looks like this:

```js
// cle.config.js
export default {
  // config options
}
```

You can also explicitly specify a config file to use with the --config CLI option (resolved relative to cwd):

```bash
cle --config my-config.js
```

### Config Intellisense

Since CLE ships with TypeScript typings, you can leverage your IDE's intellisense with jsdoc type hints:

```js
/** @type {import('@ora-io/cle-cli').UserConfig} */
export default {
  // ...
}
```
Alternatively, you can use the defineConfig helper which should provide intellisense without the need for jsdoc annotations:

```js
import { defineConfig } from '@ora-io/cle-cli'

export default defineConfig({
  // ...
})
```

CLE also directly supports TS config files. You can use cle.config.ts with the defineConfig helper as well.

### Config Options

#### JsonRpcProviderUrl

- **Type:** `object`
- **Default**: `{ mainet: "", sepolia: "", goerli: ""}`

Update your Etherum JSON RPC provider URL here.
It is recommended to use providers that support debug_getRawReceipts RPC method.  

#### UserPrivateKey

- **Type:** `string`

Update your private key here to sign zkwasm messages.
Please note that (during testnet phrase) your address balance (in zkwasm server) should > 0.


#### ZkwasmProviderUrl

- **Type:** `string`
- **Default**: `https://zkwasm-explorer.delphinuslab.com:8090`

#### CompilerServerEndpoint

- **Type:** `string`
- **Default**: `http://compiler.hyperoracle.io/compile`

#### PinataEndpoint

- **Type:** `string`
- **Default**: `https://api.pinata.cloud/pinning/pinFileToIPFS`

#### PinataJWT

- **Type:** `string`

#### WasmBinPath

- **Type:** `string`
- **Default**: `[root]/build/cle.wasm`

CLE CLI Build-In a tag name is `root`.  
The `root` is user project root path.  
Of course, you can also place this tag at any position within the string.  
