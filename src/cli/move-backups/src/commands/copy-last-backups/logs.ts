import { Log } from '@zougui/logger';
import { Exception } from '@zougui/error';

import { FsTabEntry } from '../../fstab';

export const LookingForLastBackupsLog = new Log()
  .setCode('backup.last.find.start')
  .setTopics(['backup'])
  .setMessage('Looking for the last backup...')
  .toClass();

export const NoLastBackupsLog = new Log()
  .setCode('backup.last.find.none')
  .setTopics(['backup'])
  .setMessage('No backups found.')
  .toClass();

export interface LastBackupsFoundLogData {
  backupsPath: string[];
}

export const LastBackupsFoundLog = new Log<LastBackupsFoundLogData>()
  .setCode('backup.last.find.success')
  .setTopics(['backup'])
  .setMessage('Last backups found')
  .toClass();

export interface CopyBackupLogData {
  partitionMountPoint: string;
  backupPath: string;
}

export const CopyBackupLog = new Log<CopyBackupLogData>()
  .setCode('backup.copy.start')
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Backup partition "${data.partitionMountPoint}": Copying backup...`)
  .toClass();

export interface CopiedBackupLogData {
  partitionMountPoint: string;
  backupPath: string;
}

export const CopiedBackupLog = new Log<CopiedBackupLogData>()
  .setCode('backup.copy.success')
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Backup partition "${data.partitionMountPoint}": Copied backup`)
  .toClass();

export interface UnmountErrorLogData {
  fsEntry: FsTabEntry;
  error: Exception;
}

export const UnmountErrorLog = new Log<UnmountErrorLogData>()
  .setCode('partition.unmount.error')
  .setTopics(['partition', 'unmount'])
  .setMessage(({ data }) => `Could not unmount the partition "${data.fsEntry.fileSystem.id}".`)
  .toClass();

export interface PowerOffErrorLogData {
  drive: {
    label: string;
    devPath: string;
    mountPoint: string;
    mounted: boolean;
  };
}

export const PowerOffErrorLog = new Log<PowerOffErrorLogData>()
  .setCode('drive.powerOff.error')
  .setTopics(['drive', 'powerOff'])
  .setMessage(({ data }) => `Could not power-off the drive "${data.drive.label}".`)
  .toClass();

export interface FindLastBackupsErrorLogData {
  dir: string;
  error: Exception;
}

export const FindLastBackupsErrorLog = new Log<FindLastBackupsErrorLogData>()
  .setCode('backup.last.find.error')
  .setTopics(['backup'])
  .setMessage('Could\'t find the last backup.')
  .toClass();
