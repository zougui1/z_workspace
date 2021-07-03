import { LogLevel } from '../LogLevel';

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
  createdAt: Date;
  format: string;
}

export interface ILogProfile {
  label: string;
  timing: {
    formatted: string;
    milliseconds: number;
  };
}

export interface ILog<T extends Record<string, any> = any> {
  id: string;
  level: LogLevel;
  profile?: ILogProfile;
  code: string;
  message: string;
  topics: string[];
  time: ILogTime;
  data: T;
  context: ILogContext;
}
