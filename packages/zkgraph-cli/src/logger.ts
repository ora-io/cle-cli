/* eslint no-console: 0 */
import colors from 'picocolors'

export interface Logger {
  info(msg: string): void
  warn(msg: string): void
  error(msg: string): void
}

export type LogType = 'error' | 'warn' | 'info'
export type LogLevel = LogType | 'silent'

export const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
}

export function createLogger(
  level: LogLevel = 'info',
  prefix: '[zkGraph]',
) {
  const thresh = LogLevels[level]

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  function output(type: LogType, msg: string) {
    if (thresh >= LogLevels[type]) {
      const method = type === 'info' ? 'log' : type
      const format = () => {
        const tag
            = type === 'info'
              ? colors.cyan(colors.bold(prefix))
              : type === 'warn'
                ? colors.yellow(colors.bold(prefix))
                : colors.red(colors.bold(prefix))
        return `${colors.dim(timeFormatter.format(new Date()))} ${tag} ${msg}`
      }
      console[method](format())
    }
  }

  const logger: Logger = {
    info(msg) {
      output('info', msg)
    },
    warn(msg) {
      output('warn', msg)
    },
    error(msg) {
      output('error', msg)
    },
  }
  return logger
}
