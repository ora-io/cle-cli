export function proveCLIHasModeOption() {
  const proveModeOptions = ['-i', '-t', '-p', '--inputgen', '--test', '--prove']
  const argv = process.argv
  if (!argv.length)
    return false

  const command = argv[2]
  if (command === 'prove') {
    for (let i = 3; i < argv.length; i++) {
      if (proveModeOptions.includes(argv[i]))
        return true
    }
  }
  return false
}
