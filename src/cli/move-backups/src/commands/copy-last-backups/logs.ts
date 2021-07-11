import { LogBuilder } from '@zougui/logger';
import { PartialException } from '@zougui/error';
import env from '@zougui/env';
import { transactionContext } from '@zougui/transaction-context';

import { FsTabEntry } from '../../fstab';

const scope = env.getScope(__filename);

export const LookingForLastBackupsLog = new LogBuilder()
  .setCode('backup.last.find.start')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup'])
  .setMessage('Looking for the last backup...')
  .toClass();

export const NoLastBackupsLog = new LogBuilder()
  .setCode('backup.last.find.none')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup'])
  .setMessage('No backups found.')
  .toClass();

export interface LastBackupsFoundLogData {
  backupsPath: string[];
}

export const LastBackupsFoundLog = new LogBuilder<LastBackupsFoundLogData>()
  .setCode('backup.last.find.success')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup'])
  .setMessage('Last backups found')
  .toClass();

export interface CopyBackupLogData {
  partitionMountPoint: string;
  backupPath: string;
}

export const CopyBackupLog = new LogBuilder<CopyBackupLogData>()
  .setCode('backup.copy.start')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Backup partition "${data.partitionMountPoint}": Copying backup...`)
  .toClass();

export interface CopiedBackupLogData {
  partitionMountPoint: string;
  backupPath: string;
}

export const CopiedBackupLog = new LogBuilder<CopiedBackupLogData>()
  .setCode('backup.copy.success')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Backup partition "${data.partitionMountPoint}": Copied backup`)
  .toClass();

export interface UnmountErrorLogData {
  fsEntry: FsTabEntry;
  error: PartialException;
}

export const UnmountErrorLog = new LogBuilder<UnmountErrorLogData>()
  .setCode('partition.unmount.error')
  .setScope(scope)
  .setTransaction(transactionContext)
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

export const PowerOffErrorLog = new LogBuilder<PowerOffErrorLogData>()
  .setCode('drive.powerOff.error')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['drive', 'powerOff'])
  .setMessage(({ data }) => `Could not power-off the drive "${data.drive.label}".`)
  .toClass();

export interface FindLastBackupsErrorLogData {
  dir: string;
  error: PartialException;
}

export const FindLastBackupsErrorLog = new LogBuilder<FindLastBackupsErrorLogData>()
  .setCode('backup.last.find.error')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup'])
  .setMessage('Could\'t find the last backup.')
  .toClass();
