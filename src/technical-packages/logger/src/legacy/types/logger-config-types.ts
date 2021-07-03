import { LogLevel } from '../LogLevel';

export interface ILogLevelConfig {
  color: string;
}

export type LogLevelsConfig = Record<LogLevel, ILogLevelConfig>;

export type BaseTransortConfig = {
  levels?: LogLevel[];
} & LogLevelsConfig;

export type ConsoleLogConfig = BaseTransortConfig;
export type FileLogConfig = {
  fileName: string;
} & BaseTransortConfig;
export type DiscordLogConfig = {
  server: string;
  token: string;
} & BaseTransortConfig;
export type EmailLogConfig = {
  service: string,
  to: string;
  user: string;
  password: string;
} & BaseTransortConfig;

export type LoggerConfig = {
  console: ConsoleLogConfig;
  file: FileLogConfig;
  email: EmailLogConfig;
  discord: DiscordLogConfig;
}
