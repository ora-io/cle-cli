export function logDivider() {
  const line = '='.repeat(process.stdout.columns)
  // eslint-disable-next-line no-console
  console.log(line)
}
