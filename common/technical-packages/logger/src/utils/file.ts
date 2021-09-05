import path from 'path';

import moment from 'moment';

import { APP_WORKSPACE, LOG_FILE_FORMAT } from '../env';
import { LoggerConfig } from '../config';

export const getLogFile = (config: LoggerConfig): string | undefined => {
  if (!config.file) {
    return;
  }

  return config.file === true
    ? path.join(APP_WORKSPACE, 'logs', `${moment().format(LOG_FILE_FORMAT)}.yml`)
    : config.file.file;
}
