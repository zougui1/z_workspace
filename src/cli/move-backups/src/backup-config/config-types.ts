import { IRawLogsConfig, ILogsConfig } from '@zougui/logger';

export interface IBaseConfig {
  dateFormat: string;
  backupDirFormat: string;
  backupsDirs: string[];
  externalBackupPartitions: string[];
}

export interface IRawConfig extends IBaseConfig {
  logs: IRawLogsConfig;
}

export interface IConfig extends IBaseConfig {
  logs: ILogsConfig;
}
