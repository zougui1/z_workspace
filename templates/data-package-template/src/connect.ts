import Knex from 'knex';
import * as dbCore from '@zougui/database-core';

import * as env from './env';

export const connectOnce = (): Knex<any, unknown[]> => {
  return dbCore.connectOnce({
    client: env.DB_CLIENT,
    useNullAsDefault: true,
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    },
    pool: {
      min: env.DB_POOL_MIN,
      max: env.DB_POOL_MAX,
    },
    debug: env.DB_DEBUG,
    asyncStackTraces: env.DB_DEBUG,
  });
}
