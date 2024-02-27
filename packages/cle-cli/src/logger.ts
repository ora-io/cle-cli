/* eslint no-console: 0 */
import { type CLELogger, setCLELogger } from '@ora-io/cle-api'
import colors from 'picocolors'

export type LogType = 'error' | 'warn' | 'info' | 'debug'
export type LogLevel = LogType | 'silent'

export const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  debug: 3,
  info: 4,
}

export class Logger implements CLELogger {
  level: LogLevel = 'info'
  prefix = '[CLE]'
  thresh = LogLevels[this.level]

  timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  constructor(level: LogLevel = 'info', prefix = '[CLE]') {
    this.level = level
    this.prefix = prefix
    this.thresh = LogLevels[this.level]
  }

  output(type: LogType, msg: string) {
    if (this.thresh >= LogLevels[type]) {
      const method = type === 'info' ? 'log' : type
      const format = () => {
        const tag
            = type === 'info'
              ? colors.cyan(colors.bold(this.prefix))
              : type === 'warn'
                ? colors.yellow(colors.bold(this.prefix))
                : colors.red(colors.bold(this.prefix))
        return `${colors.dim(this.timeFormatter.format(new Date()))} ${tag} ${msg}`
      }
      console[method](format())
    }
  }

  info(...args: any[]): void {
    this.output('info', args.join(''))
  }

  warn(...args: any[]): void {
    this.output('warn', args.join(''))
  }

  error(...args: any[]): void {
    this.output('error', args.join(''))
  }

  debug(...args: any[]): void {
    this.output('debug', args.join(''))
  }

  log(...args: any[]): void {
    this.info(...args)
  }
}

export function createLogger(level: LogLevel) {
  return new Logger(level)
}

// eslint-disable-next-line import/no-mutable-exports
export let logger = new Logger()
setCLELogger(logger)

export function setLogger(newLogger: Logger) {
  logger = newLogger
  setCLELogger(logger)
}
