import { Model } from '@zougui/database-core';

import { connectOnce } from '../connect';

class Log extends Model {
  static jsonAttributes = ['scope', 'profile', 'topics', 'time', 'transaction', 'context', 'data'];

  logId!: string;
  level!: string;
  scope!: { name: string; version: string };
  profile?: ILogProfile;
  code!: string;
  topics!: string[];
  time!: { createdAt: string; format: string };
  data!: Record<string, any>;
  transaction?: ILogTransaction;
  context!: ILogContext;
  message!: string;
}

export const LogModel = Log.connect(connectOnce);

export namespace LogModel {
  export type Instance = InstanceType<typeof LogModel>;
}

export interface ILogTransaction {
  id: string;
  topics: string[];
  data: Record<string, any>;
  time: {
    startedAt: string;
    finishedAt?: string;
  };
}

export interface ILogProfile {
  label: string;
  timing?: {
    formatted: string;
    milliseconds: number;
  };
}

export interface ILogContextApp {
  env: string;
  name: string;
  version: string;
  file: string;
  line?: number;
  functionName: string;
  nodeVersion: string;
}

export interface ILogContextOs {
  platform: string;
  version: string;
}

export interface ILogContextProcess {
  host?: string;
  user: string;
  processId: number;
}
export interface ILogContext {
  app: ILogContextApp;
  os: ILogContextOs;
  process: ILogContextProcess;
}
