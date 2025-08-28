/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('products', function(table) {
    // Suppression de la colonne sizes qui est maintenant remplacée par la table product_inventory
    table.dropColumn('sizes');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('products', function(table) {
    // Réajout de la colonne sizes en cas de rollback
    table.json('sizes');
  });
};