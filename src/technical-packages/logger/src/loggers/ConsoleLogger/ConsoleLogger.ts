import _ from 'lodash';
import moment from 'moment';

import { crossPlatformConsoleStyles } from './crossPlatformConsoleStyles';
import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerConsoleConfig } from '../../config';
import { ILog } from '../../log';
import { LogColor, LogLevel } from '../../enums';

export class ConsoleLogger extends BaseLogger<LoggerConsoleConfig> {

  constructor(fullConfig: LoggerConfig, config: LoggerConsoleConfig) {
    super('console', fullConfig, config);
  }

  //#region logging
  public line(count: number = 1): this {
    console.debug('\n'.repeat(count - 1));
    return this;
  }

  protected async print(log: ILog): Promise<void> {
    const { message, styles } = this.formatLog(log);

    switch (log.level) {
      case LogLevel.info:
      case LogLevel.debug:
      case LogLevel.warn:
        console[log.level](message, ...styles);
        break;
      case LogLevel.error:
      case LogLevel.fatal:
        console.error(message, ...styles);
        break;

      default:
        console.log(message, ...styles);
        break;
    }

    this.emit('logged', log.logId);
  }
  //#endregion

  //#region helpers
  protected formatLog(log: ILog): { styles: string[], message: string } {
    const timing = log.profile?.timing
      ? `(${log.profile.timing.formatted})`
      : '';

    return crossPlatformConsoleStyles([
      { message: '[' },
      {
        message: moment(log.time.createdAt).format(log.time.format),
        styles: { color: '#fff' },
      },
      { message: ' ' },
      {
        message: _.snakeCase(log.level),
        styles: { color: LogColor[log.level] },
      },
      { message: timing ? ' ' : '' },
      {
        message: timing,
        styles: { color: '#ffdd00' },
      },
      { message: '] ' },
      {
        message: log.topics[0] ?? '',
        styles: { color: '#ff39b2' },
      },
      { message: ' ' },
      { message: log.message },
    ]);
  }
  //#endregion
}
