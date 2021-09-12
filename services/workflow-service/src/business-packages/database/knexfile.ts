import * as env from './src/env';

export default {

  development: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  test: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },

  production: {
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
    migrations: {
      tableName: "knex_migrations",
      loadExtensions: [`.ts`],
    },
  },
};
