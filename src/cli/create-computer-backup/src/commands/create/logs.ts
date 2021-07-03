import { Log } from '@zougui/logger';

import { Backup } from '../../backup-config';

export interface MakingBackupLogData {
  backup: Backup;
}

export const MakingBackupLog = new Log<MakingBackupLogData>()
  .setCode('backup.create.start')
  .setTopics(['backup'])
  .setMessage(({ data }) => `Start making backup of "${data.backup.label}"`)
  .toClass();

export interface MadeBackupLogData {
  backup: Backup;
}

export const MadeBackupLog = new Log<MadeBackupLogData>()
  .setCode('backup.create.success')
  .setTopics(['backup'])
  .setMessage(({ data }) => `Made backup of "${data.backup.label}"`)
  .toClass();

export interface MissingOptionalInputsLogData {
  backups: Backup[];
}

export const MissingOptionalInputsLog = new Log<MissingOptionalInputsLogData>()
  .setCode('backup.inputs.optional.missing')
  .setTopics(['backup'])
  .setMessage(({ data }) => `The following optional inputs do not exist:\n  ${data.backups.flatMap(b => `  ${b.inputs}`)}`)
  .toClass();

export interface MissingRequiredInputsLogData {
  backups: Backup[];
}

export const MissingRequiredInputsLog = new Log<MissingRequiredInputsLogData>()
  .setCode('backup.inputs.required.missing')
  .setTopics(['backup'])
  .setMessage(({ data }) => `The following required inputs do not exist:\n  ${data.backups.flatMap(b => `  ${b.inputs}`)}`)
  .toClass();

export const ComputingInputsSize = new Log()
  .setCode('backup.size.compute.start')
  .setTopics(['backup', 'size'])
  .setMessage('computing inputs sizes')
  .toClass();

export interface ComputingInputSizeData {
  backup: Backup;
  input: string;
}

export const ComputingInputSize = new Log<ComputingInputSizeData>()
  .setCode('backup.inputs.size.compute.start')
  .setTopics(['backup', 'size'])
  .setMessage(({ data }) => `Computing the size of "${data.input}"`)
  .toClass();

export interface CopyInputData {
  backup: Backup;
  input: string;
}

export const CopyInput = new Log<CopyInputData>()
  .setCode('backup.inputs.copy.start')
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Copying "${data.input}"...`)
  .toClass();

export interface CopiedInputData {
  backup: Backup;
  input: string;
}

export const CopiedInput = new Log<CopiedInputData>()
  .setCode('backup.inputs.copy.success')
  .setTopics(['backup', 'copy'])
  .setMessage(({ data }) => `Copied "${data.input}"`)
  .toClass();

export interface CompressInputData {
  backup: Backup;
}

export const CompressInput = new Log<CompressInputData>()
  .setCode('backup.inputs.compress.start')
  .setTopics(['backup', 'compression'])
  .setMessage(({ data }) => `Compressing "${data.backup.label}"...`)
  .toClass();

export interface CompressedInputData {
  backup: Backup;
}

export const CompressedInput = new Log<CompressedInputData>()
  .setCode('backup.inputs.compress.success')
  .setTopics(['backup', 'compression'])
  .setMessage(({ data }) => `Compressed "${data.backup.label}"`)
  .toClass();
