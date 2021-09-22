import { ILog } from '@zougui/log-types';

import { log } from '@log-service/database';

export const findTransactions = async (transactionId: string): Promise<ILog[]> => {
  return await log.findTransactions(transactionId);
}
