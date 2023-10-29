export function generateConfigFileContent(privateKey: string) {
  return `import { UserConfig } from '@hyperoracle/zkgraph-cli'

export default {
  // Set up your config here${!privateKey ? '\n  // Please set up your private key' : ''}
  UserPrivateKey: ${privateKey ? `'${privateKey}'` : '\'\''},
} as UserConfig
`
}
