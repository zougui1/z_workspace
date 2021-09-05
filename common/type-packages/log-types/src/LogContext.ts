import { EnvironmentTypes } from './log-enums';

export interface ILogContextApp {
  env: string;
  name: string;
  version: string;
  file: string;
  line?: number;
  functionName: string;
}

export interface ILogBaseContext {
  env: EnvironmentTypes.mobile | EnvironmentTypes.electron;
  app: ILogContextApp;
}

//#region node process
export interface ILogNodeContextOs {
  platform: string;
  version: string;
}

export interface ILogNodeProcess {
  os: ILogNodeContextOs;
  nodeVersion: string;
  host?: string;
  user: string;
  processId: number;
}
//#endregion

//#region browser process
export interface ILogBrowserContextOs {
  platform: string;
}

export interface ILogBrowserProcess {
  os: ILogBrowserContextOs;
  host: string;
  userAgent: string;
  language: string;
  languages: readonly string[];
}
//#endregion

export type LogNodeContext = {
  env: EnvironmentTypes.node;
  app: ILogContextApp;
  process: ILogNodeProcess;
};

export type LogBrowserContext = {
  env: EnvironmentTypes.browser;
  app: ILogContextApp;
  process: ILogBrowserProcess;
};

export type LogContext = LogNodeContext | LogBrowserContext | ILogBaseContext;
