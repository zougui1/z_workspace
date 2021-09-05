import moment from 'moment';
import { useQuery } from 'react-query';
import { Typography } from '@material-ui/core';

import { ILog, ILogTransaction, logFormat } from '@zougui/log-types';
import logHttpClient from '@zougui/log-http-client';

import { Log } from '../../Log';
import { LogTopics } from '../../LogTopics';

export const LogTransactionTab = ({ transaction }: LogTransactionTabProps) => {
  const query = useQuery('log-transactions', () => {
    return logHttpClient.getLogs({
      query: {
        transaction: { id: transaction.id }
      },
    });
  });

  const transactions: ILog[] = query.data?.data ?? [];
  const finishTransaction = transactions.find(log => log.transaction?.time.finishedAt);
  const finishedAt = finishTransaction?.transaction?.time.finishedAt;

  return (
    <div>
      <LogTopics topics={transaction.topics} />

      <Typography variant="h5">Transaction {transaction.id}</Typography>

      <Typography>
        Started on {moment(transaction.time.startedAt, logFormat).format('dddd, MMMM D, YYYY hh:mm:ss.SSS A')}
        <br />
        Finished on {finishedAt ? moment(finishedAt, logFormat).format('dddd, MMMM D, YYYY hh:mm:ss.SSS A') : 'Unknown'}
      </Typography>

      <div>
        <Typography variant="h5">Associated logs:</Typography>

        <div>
          {transactions.map(trans => (
            <Log key={trans.logId} log={trans} />
          ))}
        </div>
      </div>
    </div>
  );
}

export interface LogTransactionTabProps {
  transaction: ILogTransaction;
}
