import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add new columns to organizations table
  await knex.schema.alterTable('organizations', (table) => {
    table.string('github_repo');
    table.specificType('languages', 'text[]');
    table.text('description');
    table.string('input_file');
    table.string('output_file');
    table.string('base_language');
    table.string('last_commit');
    table.string('main_branch');
  });

  // Create strings table
  await knex.schema.createTable('strings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE').notNullable();
    table.string('file').notNullable();
    table.text('key').notNullable();
    table.text('value').notNullable();
    table.string('language').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop strings table
  await knex.schema.dropTable('strings');

  // Remove new columns from organizations table
  await knex.schema.alterTable('organizations', (table) => {
    table.dropColumn('github_repo');
    table.dropColumn('languages');
    table.dropColumn('description');
    table.dropColumn('input_file');
    table.dropColumn('output_file');
    table.dropColumn('base_language');
    table.dropColumn('last_commit');
    table.dropColumn('main_branch');
  });
}