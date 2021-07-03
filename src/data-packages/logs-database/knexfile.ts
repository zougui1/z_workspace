import * as env from './src/env';

export default {

  development: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  test: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  production: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },
};
