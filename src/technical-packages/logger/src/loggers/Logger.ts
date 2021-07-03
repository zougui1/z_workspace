import isBrowser from 'is-browser';

import { Stopwatch } from '@zougui/stopwatch';

import { BaseLogger } from './BaseLogger';
import { ConsoleLogger } from './ConsoleLogger';
import { FileLogger } from './FileLogger';
import { HttpLogger } from './HttpLogger';
import { DatabaseLogger } from './DatabaseLogger';
import { EmailLogger } from './EmailLogger';
import { DiscordLogger } from './DiscordLogger';
import { LoggerConfig } from '../config';
import { IConstructedLog } from '../log';
import { LogLevel, LogKind } from '../enums';

const nodeOnlyLoggers: Record<LogKind, boolean> = {
  [LogKind.console]: false,
  [LogKind.file]: true,
  [LogKind.http]: false,
  [LogKind.database]: true,
  [LogKind.email]: true,
  [LogKind.discord]: true,
};

class Logger {

  // @ts-ignore
  private _initialized: boolean = false;
  private _console?: ConsoleLogger;
  private _file?: FileLogger;
  private _http?: HttpLogger;
  private _database?: DatabaseLogger;
  private _email?: EmailLogger;
  private _discord?: DiscordLogger;
  private _config?: LoggerConfig;
  protected readonly _profilers: Record<string, Stopwatch> = {};

  init(config: LoggerConfig): this {
    this._config = config;

    if (config.console) {
      this._console = new ConsoleLogger(config, config.console);
    }

    if (config.file) {
      this._file = new FileLogger(config, config.file);
    }

    if (config.http) {
      this._http = new HttpLogger(config, config.http);
    }

    if (config.database) {
      this._database = new DatabaseLogger(config, config.database);
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
  public async line(count: number = 1): Promise<void> {
    await this._console?.line(count);
  }

  public async debug(log: IConstructedLog): Promise<void> {
    await this.doLog(LogLevel.debug, log);
  }

  public async info(log: IConstructedLog): Promise<void> {
    await this.doLog(LogLevel.info, log);
  }

  public async success(log: IConstructedLog): Promise<void> {
    await this.doLog(LogLevel.success, log);
  }

  public async warn(log: IConstructedLog): Promise<void> {
    await this.doLog(LogLevel.warn, log);
  }

  public async error(log: IConstructedLog): Promise<void> {
    await this.doLog(LogLevel.error, log);
  }

  public async fatal(log: IConstructedLog): Promise<void> {
    await this.doLog(LogLevel.fatal, log);
  }

  private async doLog(level: LogLevel, log: IConstructedLog): Promise<void> {
    if (log.profile) {
      const stopwatch = this._profilers[log.profile.label];

      if (stopwatch) {
        const timing = stopwatch.stop().total;
        const timingMilliseconds = stopwatch.timings.total;

        log.setProfileTiming({
          formatted: timing,
          milliseconds: timingMilliseconds,
        });
      } else {
        this._profilers[log.profile.label] = new Stopwatch().start();
      }
    }

    log.setLevel(level).setTimeFormat(this._config?.common.date.format ?? '');

    const loggers = this.findAvailableLoggers({
      [LogKind.console]: this._console,
      [LogKind.file]: this._file,
      [LogKind.http]: this._http,
      [LogKind.database]: this._database,
      [LogKind.email]: this._email,
      [LogKind.discord]: this._discord,
    }, log.logKinds);

    const logData = log.getLog();
    const logConfig = log.getConfig();

    await Promise.all(loggers.map(logger => logger.log(logData, logConfig)));
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
}

export const logger = new Logger();
