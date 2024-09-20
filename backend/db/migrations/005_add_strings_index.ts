import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("strings", (table) => {
    table.unique(["organization_id", "language", "file", "key"]);
  });
}

export async function down(knex: Knex): Promise<void> {}
