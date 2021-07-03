import moment from 'moment';
import path from 'path';
import fs from 'fs-extra';
import { logger } from '@zougui/logger';
import { Stopwatch } from '@zougui/stopwatch';
import { areAvailableOrFail, bash } from '@zougui/bash';

import { Backup, IBackupConfig, IReason, getBackupConfig } from '../../backup-config';
import { requiredBackupCreationCommands } from './requiredBackupCreationCommands';
import { ensureOutputDirs } from './ensureOutputDirs';
import { filterBackups } from './filterBackups';
import { makeBackup } from './makeBackup';
import { Reasons } from './Reasons';
import { getBackupLog } from './getBackupLog';
import { MakingBackupLog, MadeBackupLog } from './logs';

const getConfig = async (stopwatch: Stopwatch): Promise<IBackupConfig> => {
  const config = await getBackupConfig();
  stopwatch.lap('Process config');

  return config;
}

const getBackups = async (config: IBackupConfig, stopwatch: Stopwatch): Promise<Backup[]> => {
  await ensureOutputDirs(config);
  const backups = await filterBackups(config.filesystem.backups);
  stopwatch.lap('Check backup inputs');

  return backups;
}

const makeBackups = async (backups: Backup[], stopwatch: Stopwatch, options: IMakeBackupsOptions): Promise<Record<string, Record<string, string>>> => {
  const timings: Record<string, Record<string, string>> = {};

  for (const backup of backups) {
    logger.info(new MakingBackupLog({ backup }));
    console.group();

    const backupOptions = {
      threads: options.reason.threads,
    };

    const stopwatch = new Stopwatch();
    stopwatch.start();
    await makeBackup(backup, options.workspaceDir, stopwatch, backupOptions);
    timings[backup.label] = stopwatch.stop();

    console.groupEnd();
    logger.info(new MadeBackupLog({ backup }));
  }

  stopwatch.lap('Create backups');
  return timings;
}

interface IMakeBackupsOptions {
  reason: IReason;
  workspaceDir: string;
}

const processCreatedBackup = async (config: IBackupConfig, workspaceDir: string): Promise<void> => {
  await bash.move({ parameters: [workspaceDir, config.backupsDir] }).exec();
}

export const createBackup = async (options: ICreateBackupOptions) => {
  const stopwatch = new Stopwatch().start();

  const config = await getConfig(stopwatch);
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

  await areAvailableOrFail(requiredBackupCreationCommands);

  const reason = config.filesystem.reasons[options.reason];
  const date = backupDate.format(config.backupDirFormat);
  const workspaceDir = path.join(config.workspaceDir, date);

  const backups = await getBackups(config, stopwatch);
  const timings = await makeBackups(backups, stopwatch, { reason, workspaceDir });

  const globalTimings = stopwatch.stop();

  const backupLog = await getBackupLog(config, {
    backups,
    date,
    timings,
    globalTimings,
    reason: options.reason,
  });

  await fs.writeFile(path.join(workspaceDir, 'backup-log.json'), JSON.stringify(backupLog, null, 2));
  await processCreatedBackup(config, workspaceDir);
}

export interface ICreateBackupOptions {
  reason: Reasons;
}
