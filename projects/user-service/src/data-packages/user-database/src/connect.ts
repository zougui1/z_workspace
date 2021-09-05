import Knex from 'knex';
import * as dbCore from '@zougui/database-core';

import * as env from './env';

export const connectOnce = (): Knex<any, unknown[]> => {
  return dbCore.connectOnce({
    client: env.DB_USER_CLIENT,
    useNullAsDefault: true,
    connection: {
      host: env.DB_USER_HOST,
      port: env.DB_USER_PORT,
      user: env.DB_USER_USER,
      password: env.DB_USER_PASSWORD,
      database: env.DB_USER_DATABASE,
    },
    pool: {
      min: env.DB_USER_POOL_MIN,
      max: env.DB_USER_POOL_MAX,
    },
    debug: env.DB_USER_DEBUG,
    asyncStackTraces: env.DB_USER_DEBUG,
  });
}
