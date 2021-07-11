import fs from 'fs-extra';

import { separate } from '@zougui/utils';
import { logger } from '@zougui/logger';

import { MissingOptionalInputsLog, MissingRequiredInputsLog } from './logs';
import { Source } from './types';

const canBackupInput = async (input: string): Promise<{ label: string; exists: boolean; }> => {
  const exists = await fs.pathExists(input);

  return {
    label: input,
    exists,
  };
}

const canBackupSource = async (source: Source): Promise<CanBackupResult> => {
  const inputs = await Promise.all(source.inputs.map(input => canBackupInput(input)));
  const canBackup = inputs.some(input => input.exists);

  return {
    source,
    canBackup,
    inputs,
  };
}

const getInputsBackups = (sources: CanBackupResult[], inputFilter: (item: { label: string; exists: boolean; }, index: number) => any): Source[] => {
  return sources.map(({ source, inputs }) => {
    return {
      ...source,
      inputs: inputs.filter(inputFilter).map(input => input.label),
    };
  }).filter(source => source.inputs.length);
}

const separateBackups = async (allSources: Source[]): Promise<{ canBackups: Source[]; cannotBackups: Source[]; }> => {
  const backups = await Promise.all(allSources.map(canBackupSource));
  const [dirtyCanBackups, dirtyCannotBackups] = separate(backups, backup => backup.canBackup);

  const cannotBackups = getInputsBackups(dirtyCannotBackups, input => !input.exists);
  const canBackups = getInputsBackups(dirtyCanBackups, input => input.exists);

  return { canBackups, cannotBackups };
}

export const filterInputs = async (sources: Source[]) => {
  const [requiredBackups, optionalBackups] = separate(sources, backup => backup.required);
  const canBackupRequiredBackups = await separateBackups(requiredBackups);
  const canBackupOptionalBackups = await separateBackups(optionalBackups);

  if (canBackupOptionalBackups.cannotBackups.length) {
    logger.warn(new MissingOptionalInputsLog({ sources: canBackupOptionalBackups.cannotBackups }));
    logger.line();
  }

  if (canBackupRequiredBackups.cannotBackups.length) {
    const error = new MissingRequiredInputsLog({ sources: canBackupRequiredBackups.cannotBackups });
    logger.error(error);
    throw error;
  }

  logger.line();

  return [...canBackupRequiredBackups.canBackups, ...canBackupOptionalBackups.canBackups];
}

interface CanBackupResult {
  source: Source;
  canBackup: boolean;
  inputs: { label: string, exists: boolean }[];
}
