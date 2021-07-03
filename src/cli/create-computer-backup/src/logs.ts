import { Log } from '@zougui/logger';

export interface BackupErrorLogData {
  error: any;
}

export const BackupErrorLog = new Log<BackupErrorLogData>()
  .setCode('backup.error')
  .setTopics(['backup'])
  .setMessage(({ data }) => `An error occured while trying to back-up:\n${data.error?.message ?? data.error ?? 'No error message provided.'}`)
  .toClass();
