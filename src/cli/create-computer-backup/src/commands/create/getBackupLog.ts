import prettyBytes from 'pretty-bytes';
import { logger } from '@zougui/logger';

import { IBackupConfig, Backup } from '../../backup-config';
import { Reasons } from './Reasons';
import { getBackupCause } from './getBackupCause';
import { ComputingInputsSize, ComputingInputSize } from './logs';
import { getPackagesList } from '../../package-manager';
import { getFolderSize } from '../../utils';

const getSize = async (input: string): Promise<string> => {
  return prettyBytes(await getFolderSize(input));
}

export const getBackupLog = async (config: IBackupConfig, { backups, date, timings, globalTimings, reason }: IBackupData) => {
  const sizes: Record<string, Record<string, string>> = {};

  const inputs = backups.flatMap(backup => {
    return backup.inputs.map(input => {
      return {
        backup,
        input,
      };
    });
  });

  const computingSizesLog = new ComputingInputsSize({});
  logger.info(computingSizesLog);

  await Promise.all(inputs.map(async ({ backup, input }) => {
    const profileLog = new ComputingInputSize({ backup, input })
    sizes[backup.label] ??= {};

    logger.info(profileLog);
    sizes[backup.label][input] = await getSize(input);
    logger.info(profileLog);
  }));

  logger.info(computingSizesLog);

  const backupsLog = config.filesystem.backups.reduce((backupsLog, backup) => {
    const includedBackup = backups.find(includedBackup => includedBackup.label === backup.label);

    const inputs = backup.inputs.reduce((inputs, input) => {
      return {
        ...inputs,
        [input]: {
          included: includedBackup?.inputs.some(includedInput => includedInput === input) ?? false,
          size: sizes[backup.label]?.[input] ?? 'unknown',
        },
      };
    }, {} as any);

    return {
      ...backupsLog,
      [backup.label]: {
        inputs,
        timings: timings[backup.label]
      },
    };
  }, {} as any);

  const packages = await getPackagesList();
  const cause = await getBackupCause(config, reason);

  const log = {
    dateFormat: config.backupDirFormat,
    date,
    reason: {
      label: reason,
      causedBy: cause,
    },
    backups: backupsLog,
    packages,
    timings: globalTimings,
  };

  return log
}

export interface IBackupData {
  backups: Backup[];
  date: string;
  reason: Reasons;
  timings: Record<string, Record<string, string>>;
  globalTimings: Record<string, string>;
}
