import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('workflow_events', table => {
    table.increments('id').primary();
    table.string('appName', 100).notNullable();
    // Objects as JSON string
    table.string('workflow', 500).notNullable();
    table.text('state').notNullable();
    table.text('event').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('logs');
}
