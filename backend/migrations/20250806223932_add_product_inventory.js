/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('product_inventory', function(table) {
      table.increments('id').primary();
      table.integer('product_id').unsigned().notNullable();
      table.string('size').notNullable();
      table.integer('quantity').unsigned().notNullable().defaultTo(0);
      table.timestamps(true, true);
      
      // Clé étrangère vers la table produits
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
      
      // Index composite pour assurer l'unicité de la combinaison produit/taille
      table.unique(['product_id', 'size']);
    })
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .then(function() {
      return knex.schema.dropTableIfExists('product_inventory');
    });
};
