import { toFunction } from '@zougui/utils';

import { LogKind } from '../LogKind';

export class SpecificData<T extends Record<string, any>> {
  protected readonly _specificData: Partial<Record<LogKind, (ctx: BaseLogContext<T>) => any>> = {};
  protected _defaultData?: (ctx: BaseLogContext<T>) => any;

  //#region setters
  setData(logKind: LogKind, data: any | ((ctx: BaseLogContext<T>) => any)): this {
    this._specificData[logKind] = toFunction(data);
    return this;
  }

  setDefaultData(data: any | ((ctx: BaseLogContext<T>) => any)): this {
    this._defaultData = toFunction(data);
    return this;
  }

  setConsoleData(data: any | ((ctx: BaseLogContext<T>) => any)): this {
    return this.setData(LogKind.console, data);
  }

  setFileData(data: any | ((ctx: BaseLogContext<T>) => any)): this {
    return this.setData(LogKind.file, data);
  }

  setDiscordData(data: any | ((ctx: BaseLogContext<T>) => any)): this {
    return this.setData(LogKind.discord, data);
  }

  setEmailData(data: any | ((ctx: BaseLogContext<T>) => any)): this {
    return this.setData(LogKind.email, data);
  }
  //#endregion

  //#region getters
  getData(logKind: LogKind): ((ctx: BaseLogContext<T>) => any) | undefined {
    //console.log(this._defaultData?.toString(), this._defaultData?.({ values: {}, options: { } } as any))
    //console.log('this', this)
    return this._specificData[logKind] ?? this._defaultData;
  }
  //#endregion
}

export interface BaseLogContextOptions {
  logFile?: string;
  dateFormat?: string;
}

export interface BaseLogContext<T extends Record<string, any>> {
  values: T;
  options: BaseLogContextOptions;
}
