import { LoggerConfig } from '@zougui/logger';

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

export interface IBackupConfig extends IBaseBackupConfig {
  threads: number;
  logs: LoggerConfig;
}
