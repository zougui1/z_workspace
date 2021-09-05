import moment from 'moment';
import { PartialDeep } from 'type-fest';

import { doTry } from '@zougui/error';
import { ILog, logFormat } from '@zougui/log-types';

import { logSchema } from './logSchema';
import { LogValidationError } from './errors';

export const validateLog = async (log: PartialDeep<ILog>): Promise<ILog> => {
  const createdAt = log?.createdAt;
  const transacStartedAt = log?.transaction?.time?.startedAt;
  const transacFinishedAt = log?.transaction?.time?.finishedAt;

  if (createdAt) {
    (log as any).createdAt = moment.isMoment(createdAt) ? createdAt.toDate() : createdAt;
  }
  if (transacStartedAt) {
    (log as any).transaction.time.startedAt = moment.isMoment(transacStartedAt) ? transacStartedAt.toDate() : transacStartedAt;
  }
  if (transacFinishedAt) {
    (log as any).transaction.time.finishedAt = moment.isMoment(transacFinishedAt) ? transacFinishedAt.toDate() : transacFinishedAt;
  }

  const validLog = await doTry<ILog>(() => logSchema.validateAsync(log))
    .reject(error => {
      console.log(error)
      return new LogValidationError({ error })
    });

  validLog.createdAt = moment(validLog.createdAt, logFormat).format(logFormat);

  if (validLog.transaction?.time.startedAt) {
    validLog.transaction.time.startedAt = moment(validLog.transaction.time.startedAt, logFormat).format(logFormat);
  }
  if (validLog.transaction?.time.finishedAt) {
    validLog.transaction.time.finishedAt = moment(validLog.transaction.time.finishedAt, logFormat).format(logFormat);
  }

  return validLog;
}
