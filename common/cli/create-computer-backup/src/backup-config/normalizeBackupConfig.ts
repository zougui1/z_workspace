import os from 'os';
import { clamp, applyPercentage } from '@zougui/utils';

import { IBackupConfig, Backup, IRawReason, IReason } from './backup-config-types';

const normalizeReason = (reason: IRawReason): IReason => {
  const cpus = os.cpus();

  const threads = typeof reason.threads === 'number'
    ? reason.threads
    : Math.round(clamp(applyPercentage(reason.threads, cpus.length), 1, cpus.length));

  return {
    threads,
  };
}

export const normalizeBackupConfig = (rawConf: any): IBackupConfig => {
  const commonExcludes = rawConf.filesystem.excludes ?? [];

  const backups: Backup[] = rawConf.filesystem.backups.map((rawBackup: any) => {
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
    ...rawConf,
    filesystem: {
      ...rawConf.filesystem,
      reasons: {
        manual: normalizeReason(rawConf.filesystem.reasons.manual),
        boot: normalizeReason(rawConf.filesystem.reasons.boot),
        packageInstall: normalizeReason(rawConf.filesystem.reasons.packageInstall),
        packageUpgrade: normalizeReason(rawConf.filesystem.reasons.packageUpgrade),
        packageRemove: normalizeReason(rawConf.filesystem.reasons.packageRemove),
      },
      backups,
    }
  };
}
