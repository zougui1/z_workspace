import { LogBuilder } from '@zougui/logger';
import env from '@zougui/env';
import { getErrorMessage } from '@zougui/error';
import { transactionContext } from '@zougui/transaction-context';

const scope = env.getScope(__filename);

export interface BackupErrorLogData {
  error: any;
}

export const BackupErrorLog = new LogBuilder<BackupErrorLogData>()
  .setCode('backup.error')
  .setScope(scope)
  .setTransaction(transactionContext)
  .setTopics(['backup'])
  .setMessage(({ data }) => `An error occured while trying to back-up:\n${getErrorMessage(data.error)}`)
  .toClass();
