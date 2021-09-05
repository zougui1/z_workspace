import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';

import { FsTabEntry } from '../fstab';

const scope = env.getScope(__filename);

export const InitWatcherLog = new LogBuilder()
  .setCode('filesystem.watcher.start')
  .setScope(scope)
  .setTopics(['filesystem', 'watcher'])
  .setMessage('Watching for external backup partitions...')
  .toClass();

export interface BackupPartitionMountedLogData {
  fsEntry: FsTabEntry;
}

export const BackupPartitionMountedLog = new LogBuilder<BackupPartitionMountedLogData>()
  .setCode('partition.mount.success')
  .setScope(scope)
  .setTopics(['partition', 'mount'])
  .setMessage(({ data }) => {
    const { type, id } = data.fsEntry.fileSystem;
    return `Backup partition "${type} = ${id}" mounted at "${data.fsEntry.mountPoint}".`
  })
  .toClass();
