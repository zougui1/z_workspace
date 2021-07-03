import { LogLevel } from '../enums';

export type LoggerBaseConfig = {
  levels?: LogLevel[];
}

export type LoggerConsoleConfig = boolean | LoggerBaseConfig;

export type LoggerFileConfig = {
  file: string;
} & LoggerBaseConfig;

export type LoggerDatabaseConfig = {
  batch: {
    interval: number;
    logCount: {
      min: number;
      max: number;
    };
  };
} & LoggerBaseConfig;

export type LoggerHttpConfig = {
  url: string;
  batch: {
    interval: number;
    logCount: {
      min: number;
      max: number;
    };
  };
} & LoggerBaseConfig

export type LoggerEmailConfig = {
  service: string,
  to: string;
  user: string;
  password: string;
  batch: {
    interval: number;
    logCount: {
      min: number;
      max: number;
    };
  };
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
