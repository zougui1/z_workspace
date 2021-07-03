import { Log } from '@zougui/logger';

import { FsTabEntry } from '../fstab';

export const InitWatcherLog = new Log()
  .setCode('filesystem.watcher.start')
  .setTopics(['filesystem', 'watcher'])
  .setMessage('Watching for external backup partitions...')
  .toClass();

export interface BackupPartitionMountedLogData {
  fsEntry: FsTabEntry;
}

export const BackupPartitionMountedLog = new Log<BackupPartitionMountedLogData>()
  .setCode('partition.mount.success')
  .setTopics(['partition', 'mount'])
  .setMessage(({ data }) => {
    const { type, id } = data.fsEntry.fileSystem;
    return `Backup partition "${type} = ${id}" mounted at "${data.fsEntry.mountPoint}".`
  })
  .toClass();
