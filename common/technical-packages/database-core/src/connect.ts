import Knex from 'knex';

import { TaskLogBuilder } from '@zougui/logger';
import { getErrorMessage } from '@zougui/error';

import { Model } from './Model';
import { logger } from './logger';

interface ConnectionTaskLogData {
  client: string;
  host: string;
  port: number;
  user: string;
  database: string;
}

const ConnectionTaskLog = new TaskLogBuilder<ConnectionTaskLogData>()
  .setCode('database.connection')
  .setTopics(['database', 'connection'])
  .setSubNamespace('connection')
  .setVersion('v1')
  .setMessages({
    start: ({ data }) => `Connecting to the database ${data.database}...`,
    success: ({ data }) => `Successfully connected to the database ${data.database}`,
    error: ({ data }) => `Failed to connect to the database ${data.database}: ${getErrorMessage(data.error)}`,
  })
  .toClass();

const clients: Map<string, Knex<any, unknown[]>> = new Map();

export const connect = (config: Knex.Config<any>): Knex<any, unknown[]> => {
  const client = Knex(config);
  Model.knex(client);
  return client;
}

export const connectOnce = (config: ConnectionConfig): Knex<any, unknown[]> => {
  const clientIdentifier = JSON.stringify(config.connection);
  const currentClient = clients.get(clientIdentifier);

  if (currentClient) {
    return currentClient;
  }

  const taskLogs = new ConnectionTaskLog({
    client: config.client,
    host: config.connection.host,
    port: config.connection.port,
    user: config.connection.user,
    database: config.connection.database,
  });

  const client = taskLogs.exec(() => connect(config), logger);
  clients.set(clientIdentifier, client);

  return client;
}

export interface ConnectionConfig extends Knex.Config<any> {
  client: string;
  connection: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }
}
