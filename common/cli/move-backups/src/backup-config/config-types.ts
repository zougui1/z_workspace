import { LoggerConfig } from '@zougui/logger';

export interface IBaseConfig {
  dateFormat: string;
  backupDirFormat: string;
  backupsDirs: string[];
  externalBackupPartitions: string[];
}

export interface IConfig extends IBaseConfig {
  logs: LoggerConfig;
}
