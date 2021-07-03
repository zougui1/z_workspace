import moment from 'moment';

import { LogKind, LogLevel } from '../enums';
import { LoggerConfig } from '../config';

export interface ILogContextApp {
  env: string;
  name: string;
  file: string;
  line?: number;
  functionName: string;
  nodeVersion: string;
}

export interface ILogContextOs {
  platform: string;
  version: string;
}

export interface ILogContextProcess {
  host?: string;
  user: string;
  processId: number;
}

export interface ILogContext {
  app: ILogContextApp;
  os: ILogContextOs;
  process: ILogContextProcess;
}

export interface ILogTime {
  createdAt: Date | moment.Moment | string;
  format: string;
}

export interface ILogProfile {
  label: string;
  timing?: {
    formatted: string;
    milliseconds: number;
  };
}

export interface ILog<T extends Record<string, any> = any> {
  logId: string;
  level: LogLevel;
  code: string;
  scope: string;
  topics: string[];
  message: string;
  profile?: ILogProfile;
  time: ILogTime;
  data: T;
  context: ILogContext;
}

export interface LogContext<T extends Record<string, any>> {
  level: LogLevel;
  data: T;
  time: ILogTime;
  context: ILogContext;
}

export interface IConstructedLog<T extends Record<string, any> = any> {
  readonly logKinds: LogKind[];
  readonly config?: (context: LogContext<T>) => LoggerConfig;
  readonly logId: string;
  level?: LogLevel;
  readonly code: string;
  readonly scope: string;
  readonly topics: string[];
  readonly message: (context: LogContext<T>) => string;
  readonly profile?: ILogProfile;
  readonly time: { createdAt: moment.Moment; format?: string };
  readonly data: T;
  readonly context: ILogContext;

  setLevel(level: LogLevel): this;
  setTimeFormat(timeFormat: string): this;
  setProfileTiming(timing: ILogProfile['timing']): this;
  getConfig(): LoggerConfig | undefined;
  getLog(): ILog<T>;
}
