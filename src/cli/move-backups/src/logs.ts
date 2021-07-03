import { Log } from '@zougui/logger';

export interface CopyBackupErrorLogData {
  error: any;
}

export const CopyBackupErrorLog = new Log<CopyBackupErrorLogData>()
  .setCode('backup.copy.error')
  .setTopics(['backup'])
  .setMessage(({ data }) => `An error occurred while copying the last backups:\n${data.error?.message ?? data.error ?? 'No error message provided.'}`)
  .toClass();
