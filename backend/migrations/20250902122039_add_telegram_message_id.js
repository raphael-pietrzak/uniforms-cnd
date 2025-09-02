/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('orders', function(table) {
    table.string('telegram_message_id').nullable();
    table.string('email_message_id').nullable();
    table.timestamp('email_sent_at').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('orders', function(table) {
    table.dropColumn('telegram_message_id');
    table.dropColumn('email_message_id');
    table.dropColumn('email_sent_at');
  });
};
