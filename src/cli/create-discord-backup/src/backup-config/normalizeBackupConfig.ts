import os from 'os';
import { clamp, applyPercentage } from '@zougui/utils';
import { normalizeLoggerConfig } from '@zougui/logger';

import { IRawBackupConfig, IBackupConfig } from './backup-config-types';

export const normalizeThreads = (threads: number | string): number => {
  const cpus = os.cpus();

  return typeof threads === 'number'
    ? threads
    : Math.round(clamp(applyPercentage(threads, cpus.length), 1, cpus.length));
}

export const normalizeBackupConfig = (rawConf: unknown): IBackupConfig => {
  const rawBackupConfig = rawConf as IRawBackupConfig;

  return {
    ...rawBackupConfig,
    logs: normalizeLoggerConfig(rawBackupConfig.logs),
    threads: normalizeThreads(rawBackupConfig.threads),
  };
}
