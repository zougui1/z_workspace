import chalk from 'chalk';
import _ from 'lodash';
import moment from 'moment';

import { formatMessage } from './formatMessage';
import { BaseTransportLogger } from '../BaseTransportLogger';
import { ILoggerOptions } from '../types';
import { LogLevel } from '../LogLevel';
import { ILogObject } from '../log-utils/LogV2';
import { ConsoleLogConfig } from '../types/logger-config-types';

export class ConsoleLogger extends BaseTransportLogger<ConsoleLogConfig> {

  constructor(config: ConsoleLogConfig, options: ILoggerOptions = {}) {
    super(config, {
      ...options,
      name: 'console',
    });
  }

  //#region logging
  public line(count: number = 1): this {
    console.debug('\n'.repeat(count - 1));
    return this;
  }

  protected async print(level: LogLevel, log: ILogObject, logId: string): Promise<void> {
    const message = this.formatLog(level, log);

    switch (level) {
      case LogLevel.info:
      case LogLevel.debug:
      case LogLevel.warn:
        console[level](message);
        break;
      case LogLevel.error:
      case LogLevel.fatal:
        console.error(message);
        break;

      default:
        console.log(message);
        break;
    }

    this.emit('logged', logId);
  }
  //#endregion

  //#region helpers
  protected formatLog(level: LogLevel, log: ILogObject): string {
    const dirtyMessage = log.getMessage();
    const time = log.getTime();

    let message = formatMessage(dirtyMessage);
    const [label] = log.topics;

    const messageChalk = this.getChalk(this._config[level].color);
    const date = moment(time.createdAt).format(time.format);
    const labelledMessage = label ? `${chalk.grey(label)} ${message}` : message;

    const timing = log.profile?.timing
      ? ` (${chalk.yellowBright(log.profile.timing.formatted)})`
      : '';

    return `[${chalk.white(date)} ${messageChalk(_.snakeCase(level))}${timing}] ${labelledMessage}`;
  }

  private getChalk(color: string): chalk.Chalk {
    if (typeof (chalk as any)[color] === 'function') {
      return (chalk as any)[color];
    }

    return chalk.hex(color);
  }
  //#endregion
}
