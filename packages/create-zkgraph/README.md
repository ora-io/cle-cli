# create-zkgraph

## Getting Started

### Scaffolding Your First zkGraph Project

With NPM:
```bash
npm create zkgraph@latest
```

With Yarn:

```bash
yarn create zkgraph
```

With PNPM:

```bash
pnpm create zkgraph
```

With CLI

```bash
# install zkgraph-cli
npm install @hyperoracle/zkgraph-cli -g
# run create command
zkgraph create
# or
zkgraph init
```

Then follow the prompts!

To scaffold a **uniswapprice** template, you can directly specify the project name and the desired template using additional command line options. For instance, you can run the following command:

```sh
# npm 6.x
npm create zkgraph@latest my-zkgraph-uniswapprice --template uniswapprice

# npm 7+, extra double-dash is needed:
npm create zkgraph@latest my-zkgraph-uniswapprice -- --template uniswapprice

# yarn
yarn create zkgraph my-zkgraph-uniswapprice --template uniswapprice

# pnpm
pnpm create zkgraph my-zkgraph-uniswapprice --template uniswapprice
```
