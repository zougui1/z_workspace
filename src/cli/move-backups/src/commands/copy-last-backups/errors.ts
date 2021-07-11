import { Exception } from '@zougui/error';

import { FsTabEntry } from '../../fstab';

export interface LastBackupsNotFoundErrorData {
  dir: string;
  error: any;
}

export const LastBackupsNotFoundError = new Exception<LastBackupsNotFoundErrorData>()
  .setCode('error.backups.last.notFound')
  .setStatus(404)
  .setMessage(data => `Couldn't find the last backup at "${data.dir}"`)
  .toClass();

export interface LastBackupLogReadErrorData {
  backupPath: string;
  error: any;
}

export const LastBackupLogReadError = new Exception<LastBackupLogReadErrorData>()
  .setCode('backups.last.log.read.error')
  .setStatus(500)
  .setMessage(data => `Couldn't read the log of the backup "${data.backupPath}"`)
  .toClass();

export interface UnmountPartitionErrorData {
  entry: FsTabEntry;
  error: any;
}

export const UnmountPartitionErrorData = new Exception<UnmountPartitionErrorData>()
  .setCode('partition.unmount.error')
  .setStatus(500)
  .setMessage(data => `Could not unmount the partition "${data.entry.fileSystem.id}".`)
  .toClass();
