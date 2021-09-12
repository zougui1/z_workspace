import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name', 60).notNullable();
    table.string('password', 512).notNullable();
    table.boolean('passwordValid').defaultTo(true);
    table.string('email', 380).notNullable();
    table.boolean('emailValid').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('disabledAt').nullable();
  });

  await knex.schema.createTable('user_platforms', table => {
    table.increments('id').primary();
    table.string('type').notNullable();
    table.boolean('trusted').notNullable();
    table.string('userAgent', 1000).notNullable();
    table.string('deviceName').nullable();
    table.json('platform').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

    table.integer('userId').unsigned();
    table.foreign('userId').references('users.id');
  });

  await knex.schema.createTable('login_activities', table => {
    table.increments('id').primary();
    table.string('type').notNullable();
    table.string('country').notNullable();
    table.string('city').nullable();
    table.boolean('succeeded').nullable();
    table.json('tokens').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());

    table.integer('platformId').unsigned();
    table.foreign('platformId').references('user_platforms.id');

    table.integer('userId').unsigned();
    table.foreign('userId').references('users.id');
  });

  await knex.schema.createTable('roles', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });

  await knex.schema.createTable('permissions', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('ability').notNullable();
    table.json('actions').notNullable();
    table.json('subjects').notNullable();
    table.json('fields').nullable();
    table.json('conditions').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });

  await knex.schema.createTable('users_roles', table => {
    table.increments('id').primary();

    table.integer('userId').unsigned();
    table.foreign('userId').references('users.id');

    table.integer('roleId').unsigned();
    table.foreign('roleId').references('roles.id');
  });

  await knex.schema.createTable('users_permissions', table => {
    table.increments('id').primary();

    table.integer('userId').unsigned();
    table.foreign('userId').references('users.id');

    table.integer('permissionId').unsigned();
    table.foreign('permissionId').references('permissions.id');
  });

  await knex.schema.createTable('roles_permissions', table => {
    table.increments('id').primary();

    table.integer('roleId').unsigned();
    table.foreign('roleId').references('roles.id');

    table.integer('permissionId').unsigned();
    table.foreign('permissionId').references('permissions.id');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('login_activities');
  await knex.schema.dropTable('user_platforms');
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('users_roles');
  await knex.schema.dropTable('users_permissions');
  await knex.schema.dropTable('roles');
  await knex.schema.dropTable('roles_permissions');
  await knex.schema.dropTable('permissions');
}
