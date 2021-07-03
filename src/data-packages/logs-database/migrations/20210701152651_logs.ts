import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('logs', table => {
    table.increments('id').primary();
    table.string('logId').unique().notNullable();
    table.string('message', 5000).notNullable();
    table.string('level').notNullable();
    table.string('code', 512).notNullable();
    // Array as JSON string
    table.string('topics', 512).notNullable();
    // Objects as JSON string
    table.string('time', 512).notNullable();
    table.text('data').notNullable();
    table.string('context', 2500).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('logs');
}
