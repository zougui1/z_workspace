import fs from 'fs-extra';

import { Backup } from '../../backup-config';

const inputExists = async (target: string): Promise<boolean> => {
  return await fs.pathExists(target);
}

export const canBackup = async (backup: Backup): Promise<CanBackupResult> => {
  const inputsExist = await Promise.all(backup.inputs.map(inputExists));

  const inputs = backup.inputs.map((input, i) => {
    return {
      label: input,
      exists: inputsExist[i],
    };
  });
  const canBackup = inputsExist.every(exists => exists);

  return {
    backup,
    canBackup,
    inputs,
  };
}

export interface CanBackupResult {
  backup: Backup;
  canBackup: boolean;
  inputs: { label: string, exists: boolean }[];
}
