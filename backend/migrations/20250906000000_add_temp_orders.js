/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('temp_orders', function(table) {
    table.increments('id').primary();
    table.string('checkout_id').notNullable().unique();
    table.text('order_details').notNullable(); // JSON stringifié contenant les détails de la commande
    table.timestamps(true, true);
    
    // Index sur checkout_id pour des recherches rapides
    table.index('checkout_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('temp_orders');
};