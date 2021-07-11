import moment from 'moment';
import { doTry } from '@zougui/error';

import { logSchema } from './logSchema';
import { LogValidationError } from './errors';

export const validateLog = async (log: any): Promise<any> => {
  const createdAt = log?.time?.createdAt;
  const transacStartedAt = log?.transaction?.time?.startedAt;
  const transacFinishedAt = log?.transaction?.time?.finishedAt;

  if (createdAt) {
    log.time.createdAt = moment.isMoment(createdAt) ? createdAt.toDate() : createdAt;
  }
  if (transacStartedAt) {
    log.transaction.time.startedAt = moment.isMoment(transacStartedAt) ? transacStartedAt.toDate() : transacStartedAt;
  }
  if (transacFinishedAt) {
    log.transaction.time.finishedAt = moment.isMoment(transacFinishedAt) ? transacFinishedAt.toDate() : transacFinishedAt;
  }

  const validLog = await doTry<any>(() => logSchema.validateAsync(log))
    .reject(error => {
      console.log(error)
      return new LogValidationError({ error })
    });

  validLog.time.createdAt = moment(validLog.time.createdAt, validLog.time.format).format(validLog.time.format);

  if (validLog.transaction?.time.startedAt) {
    validLog.transaction.time.startedAt = moment(validLog.transaction.time.startedAt, validLog.time.format).format(validLog.time.format);
  }
  if (validLog.transaction?.time.finishedAt) {
    validLog.transaction.time.finishedAt = moment(validLog.transaction.time.finishedAt, validLog.time.format).format(validLog.time.format);
  }

  return validLog;
}
