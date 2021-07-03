import { IRawLogsConfig, ILogsConfig } from '@zougui/logger';

interface IBaseBackupConfig {
  workspaceDir: string;
  backupsDir: string;
  dateFormat: string;
  backupDirFormat: string;
  discord: IDiscordConfig;
}

interface IDiscordConfig {
  loginTimeout: number;
  token: string;
  prefix: string;
}

export interface IRawBackupConfig extends IBaseBackupConfig {
  threads: string | number;
  logs: IRawLogsConfig;
}

export interface IBackupConfig extends IBaseBackupConfig {
  threads: number;
  logs: ILogsConfig;
}
