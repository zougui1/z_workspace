import { IRawLogsConfig, ILogsConfig } from '@zougui/logger';

export interface E621Config {
  username: string;
  apiKey: string;
}

export interface IBrowseSources {
  e621: E621Config;
}

interface IBaseConfig {
  dateFormat: string;
  download: {
    baseDir: string;
  };
}

export interface IRawConfig extends IBaseConfig {
  browse: {
    fetchSubmissionInterval: string | number;
    on: {
      interval: string | number;
      boot?: boolean;
    };
    sources: IBrowseSources;
  };
  discord: {
    token: string;
    prefix: string;
    loginTimeout: number | string;
  };
  logs: IRawLogsConfig;
}

export interface IConfig extends IBaseConfig {
  browse: {
    fetchSubmissionInterval: number;
    on: {
      interval: number;
      boot?: boolean;
    };
    sources: IBrowseSources;
  };
  discord: {
    token: string;
    prefix: string;
    loginTimeout: number;
  };
  logs: ILogsConfig;
}
