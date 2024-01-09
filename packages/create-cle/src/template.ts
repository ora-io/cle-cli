export function generateConfigFileContent(privateKey: string, pinataJWT: string) {
  return `import { UserConfig } from '@hyperoracle/cle-cli'

export default {
  // Set up your config here${!privateKey ? '\n  // Please set up your private key' : ''}
  UserPrivateKey: ${privateKey ? `'${privateKey}'` : '\'\''},${!pinataJWT ? '\n  // Please set up your pinata JWT' : ''}
  PinataJWT: '${pinataJWT}',
} as UserConfig
`
}
