import { logger, List, ExitScope } from '@zougui/logger';

import { canBackup, CanBackupResult } from './canBackup';
import { MissingOptionalInputsLog, MissingRequiredInputsLog } from './logs';
import { Backup } from '../../backup-config';

const separateBackups = async (allBackups: Backup[]): Promise<{ canBackups: CanBackupResult[], cannotBackups: CanBackupResult[] }> => {
  const backups = await Promise.all(allBackups.map(canBackup));

  const cannotBackups = backups.filter(backup => !backup.canBackup);
  const canBackups = backups.filter(backup => backup.canBackup);

  return { canBackups, cannotBackups };
}

const getInexistentInputsBackups = (backups: CanBackupResult[]): Backup[] => {
  return backups.map(({ backup, inputs }) => {
    return {
      ...backup,
      inputs: inputs.filter(input => !input.exists).map(input => input.label),
    };
  });
}

const getExistentInputsBackups = (backups: CanBackupResult[]): Backup[] => {
  return backups.map(({ backup, inputs }) => {
    return {
      ...backup,
      inputs: inputs.filter(input => input.exists).map(input => input.label),
    };
  });
}

const getBackupsLists = (backups: Backup[]): List<string>[] => {
  return backups.map(backup => {
    return new List(backup.label, backup.inputs);
  });
}

export const filterBackups = async (allBackups: Backup[]): Promise<Backup[]> => {
  const optionalBackups = await separateBackups(allBackups.filter(backup => !backup.required));
  const requiredBackups = await separateBackups(allBackups.filter(backup => backup.required));

  const optionalCannotBackups = getInexistentInputsBackups(optionalBackups.cannotBackups);
  const requiredCannotBackups = getInexistentInputsBackups(requiredBackups.cannotBackups);

  const optionalBackupsMessages = getBackupsLists(optionalCannotBackups);
  const requiredBackupsMessages = getBackupsLists(requiredCannotBackups);

  if (optionalBackupsMessages.length) {
    logger.warn(new MissingOptionalInputsLog({ backups: optionalCannotBackups }));
    logger.line();
  }

  if (requiredBackupsMessages.length) {
    const error = new MissingRequiredInputsLog({ backups: requiredCannotBackups });
    logger.error(error);
    throw new ExitScope('create-backup', error);
  }

  const optionalCanBackups = getExistentInputsBackups(optionalBackups.canBackups);
  const requiredCanBackups = getExistentInputsBackups(requiredBackups.canBackups);

  return [...requiredCanBackups, ...optionalCanBackups];
}
