import { PartialDeep } from 'type-fest';

import {
  ConsoleLogConfig,
  EmailLogConfig,
  DiscordLogConfig,
  BaseTransortConfig,
  LogLevelsConfig,
} from './logger-config-types';
import { LogLevel } from '../LogLevel';

export interface ILogsConfig {
  transports: {
    console: ConsoleLogConfig & BaseTransortConfig;
    file: {
      dir: string;
    } & BaseTransortConfig;
    discord: DiscordLogConfig & BaseTransortConfig;
    email: EmailLogConfig & BaseTransortConfig;
  };
}

export type BaseRawTransortConfig = {
  levels?: LogLevel[];
} & PartialDeep<LogLevelsConfig>;

export interface IRawLogsConfig {
  levels: LogLevelsConfig;

  transports: {
    console: ConsoleLogConfig & BaseTransortConfig;
    file: {
      dir: string;
    } & BaseTransortConfig;
    discord: DiscordLogConfig & BaseTransortConfig;
    email: EmailLogConfig & BaseTransortConfig;
  };
}
