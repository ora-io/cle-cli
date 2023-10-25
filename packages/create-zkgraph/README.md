# create-zkgraph

## Getting Started

### Scaffolding Your First zkGraph Project

With NPM:
```bash
npm create zkgraph@alpha
```

With Yarn:

```bash
yarn create zkgraph@alpha
```

With PNPM:

```bash
pnpm create zkgraph@alpha
```

With CLI

```bash
# install zkgraph-cli
npm install @hyperoracle/zkgraph-cli@alpha -g
# run create command
zkgraph create
# or
zkgraph init
```

Then follow the prompts!

To scaffold a **uniswapprice** template, you can directly specify the project name and the desired template using additional command line options. For instance, you can run the following command:

```sh
# npm 6.x
npm create zkgraph@alpha my-zkgraph-uniswapprice --template uniswapprice

# npm 7+, extra double-dash is needed:
npm create zkgraph@alpha my-zkgraph-uniswapprice -- --template uniswapprice

# yarn
yarn create zkgraph@alpha my-zkgraph-uniswapprice --template uniswapprice

# pnpm
pnpm create zkgraph@alpha my-zkgraph-uniswapprice --template uniswapprice
```
