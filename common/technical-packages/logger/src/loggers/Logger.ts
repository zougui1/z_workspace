import isBrowser from 'is-browser';

import { Stopwatch } from '@zougui/stopwatch';
import { LogLevel, LogLevelNumber, LogKind, ILog } from '@zougui/log-types';

import { BaseLogger } from './BaseLogger';
import { ConsoleLogger } from './ConsoleLogger';
import { FileLogger } from './FileLogger';
import { HttpLogger } from './HttpLogger';
import { EmailLogger } from './EmailLogger';
import { DiscordLogger } from './DiscordLogger';
import { LoggerConfig } from '../config';
import { IConstructedLog } from '../log';
import { canLog } from '../utils';
import { DISABLE_HTTP } from '../env';

const nodeOnlyLoggers: Record<LogKind, boolean> = {
  [LogKind.console]: false,
  [LogKind.file]: true,
  [LogKind.http]: false,
  [LogKind.email]: true,
  [LogKind.discord]: true,
};

export class Logger {

  private _initialized: boolean = false;
  private _console?: ConsoleLogger;
  private _file?: FileLogger;
  private _http?: HttpLogger;
  private _email?: EmailLogger;
  private _discord?: DiscordLogger;
  private readonly namespace: string;
  protected readonly _profilers: Record<string, Stopwatch> = {};

  constructor(namespace?: string) {
    this.namespace = namespace ?? '*';
  }

  init(config: LoggerConfig): this {
    if (config.console) {
      this._console = new ConsoleLogger(config, config.console);
    }

    if (config.file) {
      this._file = new FileLogger(config, config.file);
    }

    if (config.http && !DISABLE_HTTP) {
      this._http = new HttpLogger(config, config.http);
    }

    if (config.email) {
      this._email = new EmailLogger(config, config.email);
    }

    if (config.discord) {
      this._discord = new DiscordLogger(config, config.discord);
    }

    this._initialized = true;
    return this;
  }

  //#region logging
  public line = async (count: number = 1): Promise<void> => {
    await this._console?.line(count);
  }

  public debug = async (log: IConstructedLog): Promise<LogResult> => {
    return await this.doLog(LogLevel.debug, log);
  }

  public info = async (log: IConstructedLog): Promise<LogResult> => {
    return await this.doLog(LogLevel.info, log);
  }

  public success = async (log: IConstructedLog): Promise<LogResult> => {
    return await this.doLog(LogLevel.success, log);
  }

  public warn = async (log: IConstructedLog): Promise<LogResult> => {
    return await this.doLog(LogLevel.warn, log);
  }

  public error = async (log: IConstructedLog): Promise<LogResult> => {
    return await this.doLog(LogLevel.error, log);
  }

  public fatal = async (log: IConstructedLog): Promise<LogResult> => {
    return await this.doLog(LogLevel.fatal, log);
  }

  public oneOf = async (levels: LogLevel[], log: IConstructedLog): Promise<LogResult> => {
    const canLogLevels = levels.filter(level => {
      return canLog({
        namespace: log.namespace || this.namespace,
        topics: log.topics,
        level,
      });
    });
    const loggableLevelNumbers = canLogLevels.map(level => LogLevelNumber[level]);
    const highestLevelNumber = Math.max(...loggableLevelNumbers);
    const highestLevel = canLogLevels.find(level => LogLevelNumber[level] === highestLevelNumber);

    if (!highestLevel) {
      return { logged: false };
    }

    return await this.doLog(highestLevel, log);
  }

  private async doLog(level: LogLevel, log: IConstructedLog): Promise<LogResult> {
    log.setLevel(level).setNamespace(this.namespace);

    const canPerformLog = canLog({
      namespace: log.namespace || this.namespace,
      topics: log.topics,
      level,
    });

    if (!canPerformLog) {
      return { logged: false };
    }

    try {
      await this.performLog(log);
      return { logged: true };
    } catch (error) {
      console.error(`An error occurred while trying to log "${log.code}"`);
      console.error(error);
      return { logged: false, error };
    }
  }

  private async performLog(log: IConstructedLog): Promise<void> {
    const logData = log.getLog();
    const logConfig = log.getConfig();

    if (logData.task) {
      const stopwatch = this._profilers[logData.task.id];

      if (stopwatch) {
        const timing = stopwatch.stop().total;
        const timingMilliseconds = stopwatch.timings.total;

        logData.task.timing = {
          formatted: timing,
          milliseconds: timingMilliseconds,
        };
      } else {
        this._profilers[logData.task.id] = new Stopwatch().start();
      }
    }

    if (!this._initialized) {
      this.logFallback(logData);
      return;
    }

    const loggers = this.findAvailableLoggers({
      [LogKind.console]: this._console,
      [LogKind.file]: this._file,
      [LogKind.http]: this._http,
      [LogKind.email]: this._email,
      [LogKind.discord]: this._discord,
    }, log.logKinds);

    try {
      await Promise.all(loggers.map(logger => logger.log(logData, logConfig)));
    } catch (error) {
      console.error(`An error occurred while logging:\n  ${logData.message}\nError: ${error}`);
    }
  }
  //#endregion

  //#region helpers
  private findAvailableLoggers(loggers: Record<LogKind, BaseLogger<any> | undefined>, kinds: LogKind[] | undefined): BaseLogger<any>[] {
    return Object
      .entries(loggers)
      .filter(([name, value]) => value && this.canLog(name as LogKind, kinds))
      .map(([name, logger]) => logger) as BaseLogger<any>[];
  }

  private canLog(kind: LogKind, kinds: LogKind[] | undefined): boolean {
    return (!isBrowser || !nodeOnlyLoggers[kind]) && (!kinds?.length || kinds.includes(kind));
  }
  //#endregion

  //#region private
  private logFallback(log: ILog): void {
    console.group('Tried to log without configuring the logger:');
    console.warn(log.message);

    if (log.data.error) {
      console.log(log.data.error);
    } else if ([LogLevel.warn, LogLevel.error, LogLevel.fatal].includes(log.level)) {
      console.trace();
    }

    console.groupEnd();
  }
  //#endregion
}

export const logger = new Logger();

export interface LogResult {
  logged: boolean;
  error?: any;
}
