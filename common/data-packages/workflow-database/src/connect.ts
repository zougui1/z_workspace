import Knex from 'knex';
import * as dbCore from '@zougui/database-core';

import * as env from './env';

export const connectOnce = (): Knex<any, unknown[]> => {
  return dbCore.connectOnce({
    client: env.DB_WORKFLOW_CLIENT,
    useNullAsDefault: true,
    connection: {
      host: env.DB_WORKFLOW_HOST,
      port: env.DB_WORKFLOW_PORT,
      user: env.DB_WORKFLOW_USER,
      password: env.DB_WORKFLOW_PASSWORD,
      database: env.DB_WORKFLOW_DATABASE,
    },
    pool: {
      min: env.DB_WORKFLOW_POOL_MIN,
      max: env.DB_WORKFLOW_POOL_MAX,
    },
    debug: env.DB_WORKFLOW_DEBUG,
    asyncStackTraces: env.DB_WORKFLOW_DEBUG,
  });
}
