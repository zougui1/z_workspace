import * as env from './src/env';

export default {

  development: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  test: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  production: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },
};
