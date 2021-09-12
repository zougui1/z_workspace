import { log } from '@zougui/log-database';
import { ILog } from '@zougui/log-types';

export const findTransactions = async (transactionId: string): Promise<ILog[]> => {
  return await log.findTransactions(transactionId);
}
