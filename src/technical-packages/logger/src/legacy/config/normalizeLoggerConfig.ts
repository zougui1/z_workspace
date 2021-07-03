import _ from 'lodash';

import { IRawLogsConfig, ILogsConfig } from '../types';

export const normalizeLoggerConfig = (rawConfig: IRawLogsConfig): ILogsConfig => {
  return {
    transports: {
      console: _.merge({}, rawConfig.transports.console, rawConfig.levels),
      file: _.merge({}, rawConfig.transports.file, rawConfig.levels),
      discord: _.merge({}, rawConfig.transports.discord, rawConfig.levels),
      email: _.merge({}, rawConfig.transports.email, rawConfig.levels),
    },
  };
}
