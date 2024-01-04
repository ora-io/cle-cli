export function codegenImportReplace(code: string, targetLibFilepath: string) {
  // match import {} from '@hyperoracle/zkgraph-lib'
  // or import xxx from '@hyperoracle/zkgraph-lib' RegExp
  const reg = /import+.*from\s+(\"|\')@hyperoracle\/zkgraph-lib+.*(\"|\')/g
  if (reg.test(code)) {
    const matchs = code.match(reg)
    if (!matchs?.length)
      return code
    const libReg = /@hyperoracle\/zkgraph-lib/g
    for (const match of matchs) {
      const replaceCode = match.replace(libReg, targetLibFilepath)
      code = code.replace(match, replaceCode)
    }
  }
  return code
}
