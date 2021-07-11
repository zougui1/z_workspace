import path from 'path';

import { APP_WORKSPACE } from '../env';
import { LoggerConfig } from '../config';

export const getLogFile = (config: LoggerConfig): string | undefined => {
  if (!config.file) {
    return;
  }

  return config.file === true
    ? path.join(APP_WORKSPACE, 'logs', `${Date.now()}.yml`)
    : config.file.file;
}
