import { ConsoleLogger } from './ConsoleLogger';
import { FileLogger } from './FileLogger';
import { EmailLogger } from './EmailLogger';
//import { getDefaultConsoleConfig, getDefaultOptions } from './config';
import { DiscordLogger } from './DiscordLogger';
import { LogKind } from './LogKind';
import { LogLevel } from './LogLevel';
import { ILogObject } from './log-utils/LogV2';
import { ILoggerOptions } from './types';
import { LoggerInitializedLog } from './logs';
import { LoggerConfig } from './types/logger-config-types';

class Logger {

  private _initialized: boolean = false;
  private _console?: ConsoleLogger;
  private _file?: FileLogger;
  private _email?: EmailLogger;
  private _discord?: DiscordLogger;
  private _options?: Omit<ILoggerOptions, 'logFile'>

  init(config: Partial<LoggerConfig>, options: Omit<ILoggerOptions, 'logFile'>): this {
    if (this._initialized) {
      this.warn(new LoggerInitializedLog({}));
      return this;
    }

    this._options = options;
    const loggerOptions = {
      ...options,
      logFile: config.file?.fileName,
    };

    if (config.console) {
      this._console = new ConsoleLogger(config.console, loggerOptions);
    }

    if (config.file) {
      this._file = new FileLogger(config.file, { ...loggerOptions, logFile: config.file.fileName });
    }

    if (config.email) {
      this._email = new EmailLogger(config.email, loggerOptions);
    }

    if (config.discord) {
      this._discord = new DiscordLogger(config.discord, loggerOptions);
    }

    this._initialized = true;
    return this;
  }

  //#region logging
  public line(count: number = 1): this {
    //this.fallbackInit();
    this._console?.line(count);
    return this;
  }

  public async success(log: ILogObject): Promise<void> {
    return await this.doLog(LogLevel.success, log);
  }

  public async info(log: ILogObject): Promise<void> {
    return await this.doLog(LogLevel.info, log);
  }

  public async debug(log: ILogObject): Promise<void> {
    return await this.doLog(LogLevel.debug, log);
  }

  public async warn(log: ILogObject): Promise<void> {
    return await this.doLog(LogLevel.warn, log);
  }

  public async error(log: ILogObject): Promise<void> {
    return await this.doLog(LogLevel.error, log);
  }

  public async fatal(log: ILogObject): Promise<void> {
    return await this.doLog(LogLevel.fatal, log);
  }

  private async doLog(logLevel: LogLevel, log: ILogObject): Promise<void> {
    this.fallbackInit(logLevel, log);

    const logTo = log.logKinds
    const logs: Promise<void>[] = [];

    log.time = {
      createdAt: new Date(),
      // TODO dateFormat must be required
      format: this._options?.dateFormat ?? '',
    };

    if (this._console && this.canLog(LogKind.console, logTo)) {
      logs.push(this._console.log(logLevel, log));
    }
    if (this._file && this.canLog(LogKind.file, logTo)) {
      logs.push(this._file.log(logLevel, log));
    }
    if (this._email && this.canLog(LogKind.email, logTo)) {
      logs.push(this._email.log(logLevel, log));
    }
    if (this._discord && this.canLog(LogKind.discord, logTo)) {
      logs.push(this._discord.log(logLevel, log));
    }

    await Promise.all(logs);
  }
  //#endregion

  //#region helpers
  private canLog(kind: LogKind, kinds: LogKind[] | undefined): boolean {
    return !kinds?.length || kinds.includes(kind);
  }
  //#endregion

  //#region private
  private fallbackInit(logLevel: LogLevel, log: ILogObject): void {
    if (this._initialized) {
      return;
    }

    console.log('Trying to log without config.');
    console.log(logLevel, log.code, JSON.stringify(log.data));

    //const loggerOptions = getDefaultOptions();
    //this._console = new ConsoleLogger(getDefaultConsoleConfig(), loggerOptions);
    //this._file = new FileLogger(getDefaultFileConfig(), loggerOptions);
    //this._initialized = true;
    //this._options = loggerOptions;
    //this.warn(new LogBeforeConfigurationLog({}));
  }
  //#endregion
}

export const logger = new Logger();
