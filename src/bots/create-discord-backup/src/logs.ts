import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';

const scope = env.getScope(__filename);

export interface BackupErrorLogData {
  error: any;
}

export const BackupErrorLog = new LogBuilder<BackupErrorLogData>()
  .setCode('discord.backup.error')
  .setScope(scope)
  .setTopics(['discord', 'backup'])
  .setMessage(({ data }) => `An error occured while trying to back-up discord:\n${data.error?.message ?? data.error ?? 'No error message provided.'}`)
  .toClass();
