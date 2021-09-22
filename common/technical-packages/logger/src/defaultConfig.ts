import { DATE_FORMAT, LOG_URL, BATCH_INTERVAL, BATCH_MIN, BATCH_MAX } from './env';
import { LoggerConfig } from './config';

export const defaultConfig: LoggerConfig = {
  common: {
    date: {
      format: DATE_FORMAT,
    },
  },
  console: true,
  http: {
    url: LOG_URL,
    batch: {
      interval: BATCH_INTERVAL,
      logCount: {
        min: BATCH_MIN,
        max: BATCH_MAX,
      },
    },
  },
};
