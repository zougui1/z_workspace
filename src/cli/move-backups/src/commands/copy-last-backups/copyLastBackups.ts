import path from 'path';
import moment from 'moment';
import { logger } from '@zougui/logger';
import { Exception } from '@zougui/error';
import { areAvailableOrFail } from '@zougui/bash';

import { findLastBackups } from './findLastBackups';
import { copyBackupToPartition } from './copyBackupToPartition';
import { requiredCopyBackupCommands } from './requiredCopyBackupCommands';
import {
  LookingForLastBackupsLog,
  NoLastBackupsLog,
  CopiedBackupLog,
  CopyBackupLog,
  LastBackupsFoundLog,
  UnmountErrorLog,
  PowerOffErrorLog,
} from './logs';
import { getBackupConfig } from '../../backup-config';
import { watchForExternalBackupPartitions } from '../../watcher';
import { getDevicePath, unmount, powerOffDrive } from '../../drive';

export const copyLastBackups = async () => {
  const config = await getBackupConfig();
  const backupDate = moment();
  logger.init({
    ...config.logs.transports,
    file: {
      ...config.logs.transports.file,
      fileName: path.join(config.logs.transports.file.dir, `${backupDate.format(config.backupDirFormat)}.yml`),
    },
  }, {
    dateFormat: config.dateFormat,
    metadata: { backupDate },
  });

  await areAvailableOrFail(requiredCopyBackupCommands)
  const drives: Record<string, TempDrive> = {};

  const tryPowerOff = async (): Promise<void> => {
    const drivesArray = Object.values(drives);

    if (drivesArray.every(drive => !drive.mounted)) {
      for (const drive of drivesArray) {
        await powerOffDrive(drive.devPath).catch(err => {
          logger.error(new PowerOffErrorLog({ drive }));
        });

        delete drives[drive.mountPoint];
      }
    }
  }

  watchForExternalBackupPartitions(async (mountPoint, fsEntry) => {
    const label = `Backup partition "${mountPoint}"`;
    drives[mountPoint] = {
      label,
      mountPoint,
      devPath: getDevicePath(fsEntry.fileSystem.type, fsEntry.fileSystem.id),
      mounted: true,
    };

    logger.info(new LookingForLastBackupsLog({}));
    const lastBackupsPaths = await findLastBackups(config);

    if (lastBackupsPaths.length) {
      logger.info(new LastBackupsFoundLog({ backupsPath: lastBackupsPaths }));

      for (const lastBackupPath of lastBackupsPaths) {
        const dest = path.join(mountPoint, 'backups');

        logger.info(new CopyBackupLog({ partitionMountPoint: mountPoint, backupPath: lastBackupPath}));
        await copyBackupToPartition(lastBackupPath, dest);
        logger.info(new CopiedBackupLog({ partitionMountPoint: mountPoint, backupPath: lastBackupPath}));
      }
    } else {
      logger.info(new NoLastBackupsLog({}));
    }

    try {
      await unmount(mountPoint);
    } catch (error) {
      const exception = new Exception(`Could not unmount the partition "${fsEntry.fileSystem.id}".`, 'ERR_UNMOUNT_PARTITION', error);
      const unmountErrorLog = new UnmountErrorLog({ fsEntry, error: exception });
      logger.error(unmountErrorLog);
      return;
    }

    drives[mountPoint].mounted = false;
    await tryPowerOff();
  });
}

interface TempDrive {
  label: string;
  devPath: string;
  mountPoint: string;
  mounted: boolean;
}
