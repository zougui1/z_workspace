import { LoggerConfig } from '@zougui/logger';

interface IComposedBackup {
  inputs: string[];
}

interface IBaseBackup {
  label: string;
  required?: boolean;
  excludes?: string[];
}

export type Backup = IBaseBackup & IComposedBackup;

export interface IRawReason {
  threads: number | string;
}

export interface IReason {
  threads: number;
}

export interface IExternalBackupPartition {
  mountPoint: string;
  device: {
    partuuid: string;
  };
}

interface IBaseBackupConfig {
  workspaceDir: string;
  backupsDir: string;
  dateFormat: string;
  backupDirFormat: string;
  packagesStdinTimeout: number;
  externalBackupPartitions: IExternalBackupPartition[];
}

export interface IFilesystemBackupConfig {
  excludes?: string[];
  reasons: {
    manual: IReason;
    boot: IReason;
    packageInstall: IReason;
    packageUpgrade: IReason;
    packageRemove: IReason;
  };
  backups: Backup[];
}

export interface IDiscordBackupConfig {
  prefix: string;
}

export interface IBackupConfig extends IBaseBackupConfig {
  logs: LoggerConfig;
  filesystem: IFilesystemBackupConfig;
}
