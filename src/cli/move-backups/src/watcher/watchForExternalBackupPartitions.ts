import chokidar from 'chokidar';
import { logger } from '@zougui/logger';

import { BackupPartitionMountedLog, InitWatcherLog } from './logs';
import { getFsTab, FsTabEntry } from '../fstab';

export const watchForExternalBackupPartitions = (callback: (mountPoint: string, fsEntry: FsTabEntry) => void) => {
  logger.info(new InitWatcherLog({}));

  chokidar.watch('/run/media/zougui', {
    depth: 1,
    persistent: true,
  })
    .on('addDir', async (pathName) => {
      console.log(pathName)
      const fstab = await getFsTab();

      const fsEntry = fstab.find(entry => entry.mountPoint === pathName);

      if (!fsEntry) {
        return;
      }

      console.log(new BackupPartitionMountedLog({ fsEntry }));
      callback(pathName, fsEntry);
    });
}
