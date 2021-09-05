import * as env from './src/env';

export default {

  development: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  test: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  production: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },
};
