import path from 'path';
import moment from 'moment';
import { getProcessStartDate } from '@zougui/utils';

import { ILoggerOptions } from '../types';
import { ConsoleLogConfig, FileLogConfig } from '../types/logger-config-types';
import { PROJECT_DIR } from '../constants';

const backupDirFormat = 'YYYY-MM-DD HH:mm';
const dateFormat = 'YYYY-MM-DD h:mm:ss.SSS A';
let logFileName: string | undefined;

const logFile = (): string => {
  const logDate = moment(getProcessStartDate()).format(backupDirFormat);
  return logFileName ?? path.join(PROJECT_DIR, `logs/${logDate}.yml`);
}

const logLevels = {
  success: {
    color: '#22dd22',
  },
  info: {
    color: '#55aaff',
  },
  debug: {
    color: '#1166ff',
  },
  warn: {
    color: '#ff8800',
  },
  error: {
    color: '#dd3333',
  },
  fatal: {
    color: '#ff0000',
  },
};

export const getDefaultConsoleConfig = (): ConsoleLogConfig => {
  return {...logLevels};
}

export const getDefaultFileConfig = (): FileLogConfig => {
  return {
    ...logLevels,
    fileName: logFile(),
  };
}

export const getDefaultOptions = (): ILoggerOptions & { logFile: string } => {
  return {
    logFile: logFile(),
    dateFormat: dateFormat,
    metadata: {
      processStartDate: moment(getProcessStartDate()).format(dateFormat),
      fallbackConfig: true,
    },
  };
}
