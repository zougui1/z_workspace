import _ from 'lodash';
import Emittery from 'emittery';
import { PartialDeep } from 'type-fest';

import { threadList } from '@zougui/thread-list';

import { ILog } from '../log';
import { LoggerConfig, LoggerBaseConfig } from '../config';
import { LogLevel } from '../enums';

export abstract class BaseLogger<TConf extends (boolean | LoggerBaseConfig), TEmitter extends Record<string, any> = any> extends Emittery<TEmitter & BaseLoggerEmitter> {

  protected readonly _name: string;
  protected readonly _fullConfig: LoggerConfig;
  protected readonly _config: TConf;
  private readonly _threads: Record<string, string> = {};

  constructor(name: string, fullConfig: LoggerConfig, config: TConf) {
    super();

    this._name = name;
    this._fullConfig = fullConfig;
    this._config = config;

    this._init();
  }

  //#region logging
  async log(log: ILog, logConfig?: PartialDeep<LoggerConfig>): Promise<void> {
    if(!this.canLog(log.level)) {
      return;
    }

    const threadId = threadList.addThread(`Log to ${this._name} (${log.level})`);
    this._threads[log.logId] = threadId;

    await this.print(_.cloneDeep(log), logConfig);
  }

  protected abstract print(log: ILog, logConfig?: PartialDeep<LoggerConfig>): Promise<void>;
  //#endregion

  //#region helpers
  protected canLog(level: LogLevel): boolean {
    return typeof this._config === 'boolean' || !this._config.levels || this._config.levels.includes(level);
  }
  //#endregion

  //#region region
  private _init() {
    this.on('logged', logId => {
      const threadId = this._threads[logId];

      if (typeof threadId === 'string') {
        threadList.removeThread(threadId);
        delete this._threads[logId];
      }
    });
  }
  //#endregion
}

type BaseLoggerEmitter = {
  logged: string;
}
