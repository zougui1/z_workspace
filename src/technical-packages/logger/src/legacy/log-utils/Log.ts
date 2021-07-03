import { Exception } from '@zougui/error';
import { toFunction } from '@zougui/utils';

import { SpecificData, BaseLogContext, BaseLogContextOptions } from './SpecificData';
import { LogKind } from '../LogKind';

export class Log<T extends Record<string, any>> {

  logKinds: LogKind[] = [];
  protected _options: ContextLogOptions<T> = {};
  protected namespace?: (ctx: BaseLogContext<T>) => string;
  protected label?: (ctx: BaseLogContext<T>) => string;
  error?: Exception;
  code?: string;
  options?: BaseLogContextOptions;
  protected readonly _message: SpecificData<T> = new SpecificData();
  protected readonly _details: SpecificData<T> = new SpecificData();
  protected _values?: T;

  constructor(values: T, code?: string) {
    this.code = code;
    this._values = values;
  }

  //#region setters
  setLogTo(logKinds: LogKind[]): this {
    this.logKinds = logKinds;
    return this;
  }

  addLogTo(logKind: LogKind): this {
    this.logKinds.push(logKind);
    return this;
  }

  logToLocal(): this {
    this.logKinds = [LogKind.console, LogKind.file];
    return this;
  }

  setNamespace(namespace: string | ((ctx: BaseLogContext<T>) => string)): this {
    this.namespace = typeof namespace === 'function'
      ? namespace
      : () => namespace;
    return this;
  }

  setLabel(label: string | ((ctx: BaseLogContext<T>) => string)): this {
    this.label = typeof label === 'function'
      ? label
      : () => label;
    return this;
  }

  //#region messages
  setMessage(logKind: LogKind, message: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._message.setData(logKind, message);
    return this;
  }

  setDefaultMessage(message: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._message.setDefaultData(message);
    return this;
  }

  setConsoleMessage(message: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._message.setConsoleData(message);
    return this;
  }

  setFileMessage(message: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._message.setFileData(message);
    return this;
  }

  setDiscordMessage(message: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._message.setDiscordData(message);
    return this;
  }

  setEmailMessage(message: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._message.setEmailData(message);
    return this;
  }
  //#endregion

  //#region details
  setDetails(logKind: LogKind, details: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._details.setData(logKind, details);
    return this;
  }

  setDefaultDetails(details: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._details.setDefaultData(details);
    return this;
  }

  setConsoleDetails(details: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._details.setConsoleData(details);
    return this;
  }

  setFileDetails(details: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._details.setFileData(details);
    return this;
  }

  setDiscordDetails(details: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._details.setDiscordData(details);
    return this;
  }

  setEmailDetails(details: string | ((ctx: BaseLogContext<T>) => any)): this {
    this._details.setEmailData(details);
    return this;
  }
  //#endregion

  setError(error: Exception): this {
    this.error = error;
    this.code ??= error.code;
    return this;
  }

  setOptions(options: LogOptions<T>): this {
    for (const logKind of Object.values(LogKind)) {
      if (options[logKind]) {
        this.setOption(logKind, options[logKind]);
      }
    }

    return this;
  }

  setOption<K extends LogKind>(logKind: K, options: LogOptions<T>[K]): this {
    this._options[logKind] = toFunction<LogOptions<T>[K], [BaseLogContext<T>]>(options);
    return this;
  }

  setFileOptions(options: LogOptions<T>[LogKind.file]): this {
    return this.setOption(LogKind.file, options);
  }

  setDiscordOptions(options: LogOptions<T>[LogKind.discord]): this {
    return this.setOption(LogKind.discord, options);
  }
  //#endregion

  //#region getters
  protected getValues(): T {
    if (!this._values) {
      throw new Error('Cannot get the message of a log that has no values set.');
    }

    return this._values;
  }

  protected getContext(options: BaseLogContextOptions): BaseLogContext<T> {
    return { values: this.getValues(), options };
  }

  getMessage(logKind: LogKind, options: BaseLogContextOptions): any {
    const getMessage = this._message.getData(logKind);
    return getMessage?.(this.getContext(options));
  }

  getDetails(logKind: LogKind, options: BaseLogContextOptions): any {
    const getDetails = this._details.getData(logKind);
    return getDetails?.(this.getContext(options));
  }

  getNamespace(options: BaseLogContextOptions): any {
    return this.namespace?.(this.getContext(options));
  }

  getLabel(options: BaseLogContextOptions): any {
    return this.label?.(this.getContext(options));
  }

  getOptions(options: BaseLogContextOptions): StaticLogOptions {
    const opts: StaticLogOptions = {};

    for (const logKind of Object.values(LogKind)) {
      const option = this._options[logKind];

      if (option) {
        opts[logKind] = option(this.getContext(options));
      }
    }

    return opts;
  }

  getOption<K extends LogKind>(logKind: K, options: BaseLogContextOptions): StaticLogOptions[K] | undefined {
    return this._options[logKind]?.(this.getContext(options));
  }
  //#endregion

  //#region has
  hasNamespace(): boolean {
    return !!this.namespace;
  }

  hasLabel(): boolean {
    return !!this.label;
  }
  //#endregion
}

export interface StaticLogOptions {
  [LogKind.discord]?: LogDiscordOptions;
  [LogKind.file]?: LogFileOptions;
  [LogKind.console]?: any;
  [LogKind.email]?: any;
}

export interface ContextLogOptions<T extends Record<string, any>> {
  [LogKind.discord]?: (ctx: BaseLogContext<T>) => LogDiscordOptions;
  [LogKind.file]?: (ctx: BaseLogContext<T>) => LogFileOptions;
  [LogKind.console]?: (ctx: BaseLogContext<T>) => any;
  [LogKind.email]?: (ctx: BaseLogContext<T>) => any;
}

export interface LogOptions<T extends Record<string, any>> {
  [LogKind.discord]?: StaticLogOptions[LogKind.discord] | ContextLogOptions<T>[LogKind.discord];
  [LogKind.file]?: StaticLogOptions[LogKind.file] | ContextLogOptions<T>[LogKind.file];
  [LogKind.console]?: StaticLogOptions[LogKind.console] | ContextLogOptions<T>[LogKind.console];
  [LogKind.email]?: StaticLogOptions[LogKind.email] | ContextLogOptions<T>[LogKind.email];
}

export interface LogDiscordOptions {
  server?: string;
  category?: string;
  channel?: string;
  ensureChannel?: boolean;
}

export interface LogFileOptions {
  file?: string;
}
