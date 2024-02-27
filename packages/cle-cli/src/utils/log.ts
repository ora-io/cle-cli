import { logger } from '../logger'

export function logDivider() {
  const line = '='.repeat(process.stdout.columns)

  logger.info(line)
}

export function logLoadingAnimation() {
  // If width is equal to process.stdout.columns, the bar will overflow into the next line.
  // 4 is the length of the prefix "[*] ".
  // 55 is about the same length as the longest message in this script.
  const width = Math.min(process.stdout.columns - 4, 55)
  let frame = 0
  let stop = false

  const frames = ['▓']
  let position = 0
  const intervalId = setInterval(() => {
    if (stop) {
      clearInterval(intervalId)
      // @ts-expect-error - clearLine and cursorTo are not in the types
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      return
    }

    const currentFrame = frames[frame % frames.length]
    const loadingBar = `[*] ${currentFrame.repeat(
      position,
    )}▒${currentFrame.repeat(width - position - 1)}`

    process.stdout.cursorTo(0)
    process.stdout.write(loadingBar)

    position = (position + 1) % width

    frame++
  }, 400)

  return {
    stopAndClear: () => {
      stop = true
      // @ts-expect-error - clearLine and cursorTo are not in the types
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
    },
  }
}

function millToHumanReadable(mill: number) {
  const min = Math.floor(mill / 60000)
  const sec = (mill % 60000) / 1000
  return `${min} min ${sec} sec`
}

export function taskPrettyPrint(resData: { submit_time: string | number | Date; process_started: number; process_finished: number }, prefix = '') {
  logger.info(`${prefix}Task submit time: ${resData.submit_time}`)
  logger.info(`${prefix}Process started: ${resData.process_started}`)
  logger.info(`${prefix}Process finished: ${resData.process_finished}`)
  logger.info(
    `${prefix}Pending time: ${millToHumanReadable(
      // @ts-expect-error TODO: fix this, it's incorrect, should new Date().getTime() or other
      new Date(resData.process_started) - new Date(resData.submit_time),
    )}`,
  )
  logger.info(
    `${prefix}Running time: ${millToHumanReadable(
      // @ts-expect-error TODO: fix this, it's incorrect, should new Date().getTime() or other
      new Date(resData.process_finished) - new Date(resData.process_started),
    )}`,
  )
}
