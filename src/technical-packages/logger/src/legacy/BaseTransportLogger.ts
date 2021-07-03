import os from 'os';
import { EventEmitter } from 'events';
import { threadList } from '@zougui/thread-list';
import { Stopwatch } from '@zougui/stopwatch';
import env from '@zougui/env';

import { ILoggerOptions } from './types'
import { LogLevel } from './LogLevel';
import { ILogObject } from './log-utils/LogV2';
import { BaseTransortConfig } from './types/logger-config-types';

export abstract class BaseTransportLogger<TConfig extends BaseTransortConfig> extends EventEmitter {

  protected readonly _name: string;
  protected readonly _config: TConfig;
  protected readonly _options: ILoggerOptions & IBaseTransportLoggerOptions;
  protected readonly _profilers: Record<string, Stopwatch> = {};

  constructor(config: TConfig, options: ILoggerOptions & IBaseTransportLoggerOptions) {
    super();

    this._name = options.name;
    this._config = config;
    this._options = options;

    this._init();
  }

  //#region logging
  async log(level: LogLevel, log: ILogObject): Promise<void> {
    if(!this.canLog(level)) {
      return;
    }

    if (log.profile) {
      const stopwatch = this._profilers[log.profile.label];

      if (stopwatch) {
        const timing = stopwatch.stop().total;
        const timingMilliseconds = stopwatch.timings.total;

        log.profile.timing = {
          formatted: timing,
          milliseconds: timingMilliseconds,
        };
      } else {
        this._profilers[log.profile.label] = new Stopwatch();
      }
    }

    const logId = threadList.addThread(`Log to ${this._name} (${level})`);
    log.code ??= 'log.code.unknown'
    log.context = {
      app: {
        env: env.NODE_ENV,
        name: env.PROJECT_NAME,
        file: log.file,
        line: log.line,
        functionName: log.functionName,
        nodeVersion: process.version,
      },
      process: {
        processId: process.pid,
        user: os.userInfo().username,
      },
      os: {
        platform: process.platform,
        version: os.release(),
      },
    };

    await this.print(level, log, logId);
  }

  protected abstract print(level: LogLevel, log: ILogObject, logId: string): Promise<void>;
  //#endregion

  //#region helpers
  protected canLog(level: LogLevel): boolean {
    return !this._config.levels || this._config.levels.includes(level);
  }
  //#endregion

  //#region private
  private _init() {
    this.on('logged', (logId: string) => {
      threadList.removeThread(logId);
    });
  }
  //#endregion
}

export interface IBaseTransportLoggerOptions {
  name: string;
}
