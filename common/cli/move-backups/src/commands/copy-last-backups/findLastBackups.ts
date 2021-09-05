import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';
import { logger } from '@zougui/logger';

import { FindLastBackupsErrorLog } from './logs';
import { LastBackupsNotFoundError, LastBackupLogReadError } from './errors';
import { IConfig } from '../../backup-config';

export const findLastBackups = async (config: IConfig): Promise<string[]> => {
  const backups = await Promise.all(config.backupsDirs.map(async dir => {
    try {
      const lastBackup = await findLastBackup(dir);

      if (!lastBackup) {
        throw new Error('No backup found.');
      }

      return lastBackup;
    } catch (error) {
      const exception = new LastBackupsNotFoundError({ dir, error });
      const findLastBackupsErrorLog = new FindLastBackupsErrorLog({ dir, error: exception });
      logger.error(findLastBackupsErrorLog);
    }
  }));

  return backups.filter(backup => backup) as string[];
}

const readBackupLog = async (backupPath: string): Promise<string> => {
  try {
    return await fs.readFile(path.join(backupPath, 'backup-log.json'), 'utf8');
  } catch (error) {
    throw new LastBackupLogReadError({ backupPath, error });
  }
}

const findLastBackup = async (backupsDir: string): Promise<string | undefined> => {
  const backupNames = await fs.readdir(backupsDir);
  const backupPaths = backupNames.map(backupName => path.join(backupsDir, backupName));

  const dirtyBackups = await Promise.all(
    backupPaths.map(async backupPath => {
      const backupLogStr = await readBackupLog(backupPath).catch(() => { });

      if (!backupLogStr) {
        return;
      }

      const backupLog = JSON.parse(backupLogStr);
      const backupDate = moment(backupLog.date, backupLog.dateFormat);

      return {
        date: backupDate,
        path: backupPath,
      };
    })
  );

  const backups = dirtyBackups.filter(backup => backup) as { date: moment.Moment, path: string }[];

  if (!backups.length) {
    return;
  }

  const sortedBackups = backups.sort((a, b) => {
    return a.date.toDate().valueOf() - b.date.toDate().valueOf();
  });

  const lastBackup = sortedBackups[sortedBackups.length - 1];
  return lastBackup.path;
}
