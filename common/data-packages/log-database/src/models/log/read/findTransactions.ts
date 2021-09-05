import { raw } from 'objection';

import { ILog } from '@zougui/log-types';

import { LogModel } from '../LogModel';
import { createdAtDate } from '../sql-utils';

export const findTransactions = async (transactionId: string): Promise<ILog[]> => {
  const logs = await LogModel
    .query()
    .where(raw('JSON_EXTRACT(transaction, "$.id") = ?', transactionId))
    .orderBy(createdAtDate(), 'DESC');
  return logs;
}
