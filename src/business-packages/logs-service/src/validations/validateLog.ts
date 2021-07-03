import moment from 'moment';
import { doTry } from '@zougui/error';

import { logSchema } from './logSchema';
import { LogValidationError } from './errors';
import { ILog } from '../log-types';

export const validateLog = async (log: any): Promise<ILog> => {
  const createdAt = log?.time?.createdAt;

  if (createdAt) {
    log.time.createdAt = moment.isMoment(createdAt) ? createdAt.toDate() : createdAt;
  }

  const validLog = await doTry<ILog>(() => logSchema.validateAsync(log))
    .reject(error => new LogValidationError({ error }));

  validLog.time.createdAt = moment(log.time.createdAt).format(log.time.format);

  return validLog;
}
