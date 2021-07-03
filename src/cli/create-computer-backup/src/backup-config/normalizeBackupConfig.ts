import os from 'os';
import { clamp, applyPercentage } from '@zougui/utils';
import { normalizeLoggerConfig } from '@zougui/logger';

import { IRawBackupConfig, IBackupConfig, Backup, IRawReason, IReason } from './backup-config-types';

const normalizeReason = (reason: IRawReason): IReason => {
  const cpus = os.cpus();

  const threads = typeof reason.threads === 'number'
    ? reason.threads
    : Math.round(clamp(applyPercentage(reason.threads, cpus.length), 1, cpus.length));

  return {
    threads,
  };
}

export const normalizeBackupConfig = (rawConf: unknown): IBackupConfig => {
  const rawBackupConfig = rawConf as IRawBackupConfig;
  const commonExcludes = rawBackupConfig.filesystem.excludes ?? [];

  const backups: Backup[] = rawBackupConfig.filesystem.backups.map(rawBackup => {
    const inputs = 'inputs' in rawBackup
      ? rawBackup.inputs
      : [rawBackup.input];

    return {
      label: rawBackup.label,
      inputs,
      required: rawBackup.required,
      excludes: [...commonExcludes, ...(rawBackup.excludes ?? [])],
    };
  });

  return {
    ...rawBackupConfig,
    logs: normalizeLoggerConfig(rawBackupConfig.logs),
    filesystem: {
      ...rawBackupConfig.filesystem,
      reasons: {
        manual: normalizeReason(rawBackupConfig.filesystem.reasons.manual),
        boot: normalizeReason(rawBackupConfig.filesystem.reasons.boot),
        packageInstall: normalizeReason(rawBackupConfig.filesystem.reasons.packageInstall),
        packageUpgrade: normalizeReason(rawBackupConfig.filesystem.reasons.packageUpgrade),
        packageRemove: normalizeReason(rawBackupConfig.filesystem.reasons.packageRemove),
      },
      backups,
    }
  };
}
