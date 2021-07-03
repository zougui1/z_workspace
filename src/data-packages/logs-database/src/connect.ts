import Knex from 'knex';
import * as dbCore from '@zougui/database-core';

import * as env from './env';

export const connectOnce = (): Knex<any, unknown[]> => {
  return dbCore.connectOnce({
    client: env.DB_LOGS_CLIENT,
    useNullAsDefault: true,
    connection: {
      host: env.DB_LOGS_HOST,
      port: env.DB_LOGS_PORT,
      user: env.DB_LOGS_USER,
      password: env.DB_LOGS_PASSWORD,
      database: env.DB_LOGS_DATABASE,
    },
    pool: {
      min: env.DB_LOGS_POOL_MIN,
      max: env.DB_LOGS_POOL_MAX,
    },
    debug: env.DB_LOGS_DEBUG,
    asyncStackTraces: env.DB_LOGS_DEBUG,
  });
}
