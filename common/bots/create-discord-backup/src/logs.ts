import { LogBuilder } from '@zougui/logger';

export interface BackupErrorLogData {
  error: any;
}

export const BackupErrorLog = new LogBuilder<BackupErrorLogData>()
  .setCode('discord.backup.error')
  .setVersion('1.0')
  .setTopics(['discord', 'backup'])
  .setMessage(({ data }) => `An error occured while trying to back-up discord:\n${data.error?.message ?? data.error ?? 'No error message provided.'}`)
  .toClass();
