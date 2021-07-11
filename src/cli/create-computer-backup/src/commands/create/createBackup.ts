import path from 'path';

import moment from 'moment';

import { logger } from '@zougui/logger';
import { Stopwatch } from '@zougui/stopwatch';
import { areAvailableOrFail } from '@zougui/bash';
import { transactionContext } from '@zougui/transaction-context';
import { computerBackupMachine } from '@zougui/computer-backup-workflow';

import { IBackupConfig, getBackupConfig } from '../../backup-config';
import { requiredBackupCreationCommands } from './requiredBackupCreationCommands';
import { getBackupCause } from './getBackupCause';

const getConfig = async (stopwatch: Stopwatch): Promise<IBackupConfig> => {
  const config = await getBackupConfig();
  stopwatch.lap('Process config');

  return config;
}

const executeService = async (config: IBackupConfig, options: ExecuteServiceOptions) => {
  const createBackupService = computerBackupMachine.v1.interpret();

  createBackupService.onEvent(console.log)

  createBackupService.start();
  createBackupService.send(computerBackupMachine.v1.events.START, {
    options: {
      threads: options.threads,
      workspaceDir: options.workspaceDir,
      backupsDir: config.backupsDir,
      reason: {
        type: options.reason,
        packages: await getBackupCause(config, options.reason),
      },
      backup: {
        date: options.backupDate,
        dirFormat: config.backupDirFormat,
      },
      progressBars: options.progress,
    },
    sources: config.filesystem.backups,
  });

  await createBackupService.waitDone();
}

export const createBackup = async (options: ICreateBackupOptions) => {
  const stopwatch = new Stopwatch().start();
  const config = await getConfig(stopwatch);

  logger.init(config.logs);

  await areAvailableOrFail(requiredBackupCreationCommands);

  const transactionTime = transactionContext.get('time');
  const backupDate = moment(transactionTime.startedAt);
  const date = backupDate.format(config.backupDirFormat);

  const reason = config.filesystem.reasons[options.reason];
  const workspaceDir = path.join(config.workspaceDir, date);

  await executeService(config, {
    ...options,
    threads: reason.threads,
    workspaceDir,
    backupDate,
  });
}

export interface ICreateBackupOptions {
  reason: computerBackupMachine.Reasons;
  progress: computerBackupMachine.ProgressBars[];
}

interface ExecuteServiceOptions extends ICreateBackupOptions {
  threads: number;
  workspaceDir: string;
  backupDate: moment.Moment;
}
