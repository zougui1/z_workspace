export enum LogLevel {
  debug = 'debug',
  info = 'info',
  success = 'success',
  warn = 'warn',
  error = 'error',
  fatal = 'fatal',
}

export enum LogLevelNumber {
  debug = 5,
  info = 4,
  success = 3,
  warn = 2,
  error = 1,
  fatal = 0,
}

export enum LogColor {
  debug = '#1166ff',
  info = '#55aaff',
  success = '#22dd22',
  warn = '#ff8800',
  error = '#dd3333',
  fatal = '#ff0000',
}

export enum LogKind {
  console = 'console',
  file = 'file',
  http = 'http',
  email = 'email',
  discord = 'discord',
}

export enum EnvironmentTypes {
  node = 'node',
  browser = 'browser',
  electron = 'electron',
  mobile = 'mobile',
}
