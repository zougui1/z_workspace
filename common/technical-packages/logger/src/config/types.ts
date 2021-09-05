import { LogLevel } from '@zougui/log-types';

export type LoggerBaseConfig = {
  levels?: LogLevel[];
}

export type BatchConfig = {
  interval: number;
  logCount: {
    min: number;
    max: number;
  };
};

export type LoggerConsoleConfig = boolean | LoggerBaseConfig;

export type LoggerFileConfig = boolean | {
  file: string;
} & LoggerBaseConfig;

export type LoggerDatabaseConfig = {
  batch: BatchConfig;
} & LoggerBaseConfig;

export type LoggerHttpConfig = {
  url: string;
  batch: BatchConfig;
} & LoggerBaseConfig

export type LoggerEmailConfig = {
  service: string,
  to: string;
  user: string;
  password: string;
  batch: BatchConfig;
} & LoggerBaseConfig

export type LoggerDiscordConfig = {
  server: string;
  category?: string;
  channel?: string;
  ensureChannel?: boolean;
  token: string;
} & LoggerBaseConfig

export type LoggerCommonConfig = {
  date: {
    format: string;
  };
} & LoggerBaseConfig

export interface LoggerConfig {
  common: LoggerCommonConfig;

  console?: LoggerConsoleConfig;
  file?: LoggerFileConfig;
  database?: LoggerDatabaseConfig;
  http?: LoggerHttpConfig;
  email?: LoggerEmailConfig;
  discord?: LoggerDiscordConfig;
}
