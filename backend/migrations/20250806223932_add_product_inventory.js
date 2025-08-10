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
    .then(function() {
      // Vérifier d'abord si la colonne inStock existe encore
      return knex.schema.hasColumn('products', 'inStock').then(function(exists) {
        if (exists) {
          return knex.schema.alterTable('products', function(table) {
            table.dropColumn('inStock');
          });
        }
        return Promise.resolve();
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .hasColumn('products', 'inStock')
    .then(function(exists) {
      if (!exists) {
        return knex.schema.alterTable('products', function(table) {
          table.boolean('inStock').defaultTo(true);
        });
      }
      return Promise.resolve();
    })
    .then(function() {
      return knex.schema.dropTableIfExists('product_inventory');
    });
};
