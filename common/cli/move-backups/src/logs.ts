import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';

const scope = env.getScope(__filename);

export interface CopyBackupErrorLogData {
  error: any;
}

export const CopyBackupErrorLog = new LogBuilder<CopyBackupErrorLogData>()
  .setCode('backup.copy.error')
  .setScope(scope)
  .setTopics(['backup'])
  .setMessage(({ data }) => `An error occurred while copying the last backups:\n${data.error?.message ?? data.error ?? 'No error message provided.'}`)
  .toClass();
