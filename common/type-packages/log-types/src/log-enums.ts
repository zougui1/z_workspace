export enum LogLevel {
  debug = 'debug',
  info = 'info',
  success = 'success',
  warn = 'warn',
  error = 'error',
  fatal = 'fatal',
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
  database = 'database',
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
