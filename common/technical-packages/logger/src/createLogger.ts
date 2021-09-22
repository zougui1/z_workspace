import _ from 'lodash';

import { Logger } from './loggers';
import { LoggerConfig } from './config';
import { defaultConfig } from './defaultConfig';

export const createLogger = (namespace: string, config?: Partial<LoggerConfig>): Logger => {
  return new Logger(namespace).init(_.merge({}, config || {}, defaultConfig));
}
