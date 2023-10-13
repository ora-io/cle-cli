import path from 'node:path'

export const getRelativePath = (a: string, b: string) => {
  const relativePath1 = path.relative(path.dirname(a), b)
  const relativePath2 = path.relative(path.dirname(b), a)

  return [relativePath1, relativePath2]
}

