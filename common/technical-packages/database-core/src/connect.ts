import Knex from 'knex';

import { Model } from './Model';

const clients: Map<string, Knex<any, unknown[]>> = new Map();

export const connect = (config: Knex.Config<any>): Knex<any, unknown[]> => {
  const client = Knex(config);
  Model.knex(client);
  return client;
}

export const connectOnce = (config: Knex.Config<any>): Knex<any, unknown[]> => {
  const clientIdentifier = JSON.stringify(config.connection);
  const currentClient = clients.get(clientIdentifier);

  if (currentClient) {
    return currentClient;
  }

  const client = connect(config);
  clients.set(clientIdentifier, client);

  return client;
}
