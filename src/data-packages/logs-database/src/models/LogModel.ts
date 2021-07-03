import { Model } from '@zougui/database-core';

import { connectOnce } from '../connect';

class Log extends Model {
  static readonly jsonSchema = {
    type: 'object',
    required: ['logId', 'message', 'level', 'code', 'topics', 'time', 'data', 'context'],

    properties: {
      id: { type: 'integer' },
      logId: { type: 'string' },
      message: { type: 'string' },
      level: { type: 'string' },
      code: { type: 'string' },

      topics: {
        type: 'array',
        items: { type: 'string' },
      },
      time: {
        type: 'object',
        required: ['createdAt', 'format'],

        properties: {
          createdAt: { type: 'string' },
          format: { type: 'string' },
        },
      },
      data: {
        type: 'object',
        additionalProperties: true
      },
      context: {
        type: 'object',
        required: ['app', 'os', 'process'],

        properties: {
          app: {
            type: 'object',
            required: ['env', 'name', 'file', 'functionName', 'nodeVersion'],

            properties: {
              env: { type: 'string' },
              name: { type: 'string' },
              file: { type: 'string' },
              line: { type: 'integer' },
              functionName: { type: 'string' },
              nodeVersion: { type: 'string' },
            },
          },
          os: {
            type: 'object',
            required: ['platform', 'version'],

            properties: {
              platform: { type: 'string' },
              version: { type: 'string' },
            },
          },
          process: {
            type: 'object',
            required: ['user', 'processId'],

            properties: {
              host: { type: 'string' },
              user: { type: 'string' },
              processId: { type: 'integer' },
            },
          },
        },
      },
    },
  };

  logId!: string;
  level!: string;
  code!: string;
  topics!: string[];
  time!: { createdAt: string; format: string };
  data!: Record<string, any>;
  context!: ILogContext;
  message!: string;
}

export const LogModel = Log.connect(connectOnce);

export namespace LogModel {
  export type Instance = InstanceType<typeof LogModel>;
}

export interface ILogContextApp {
  env: string;
  name: string;
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
