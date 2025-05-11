const db = require('../config/database');

async function createTables() {
  // Vérifier si les tables existent déjà
  const tableExists = async (tableName) => {
    try {
      return await db.schema.hasTable(tableName);
    } catch (error) {
      console.error(`Erreur lors de la vérification de la table ${tableName}:`, error);
      return false;
    }
  };

  // Créer table users si elle n'existe pas
  if (!(await tableExists('users'))) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('role').defaultTo('user'); // admin, user
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at');
    });
    console.log('Table users créée');
  }

  // Créer table refresh_tokens si elle n'existe pas
  if (!(await tableExists('refresh_tokens'))) {
    await db.schema.createTable('refresh_tokens', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable();
      table.string('token').notNullable().unique();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
    });
    console.log('Table refresh_tokens créée');
  }

  // Créer les autres tables si elles n'existent pas déjà
  if (!(await tableExists('products'))) {
    await db.schema.createTable('products', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.json('sizes');
      table.string('condition');
      table.string('brand');
      table.string('gender');
      table.json('images');
      table.boolean('inStock').defaultTo(true);
      table.string('category');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at');
    });
    console.log('Table products créée');
  }

  if (!(await tableExists('orders'))) {
    await db.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.string('customer_name');
      table.string('customer_email');
      table.string('payment_method');
      table.decimal('total', 10, 2);
      table.string('status').defaultTo('pending'); // pending, paid, ready, collected
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at');
    });
    console.log('Table orders créée');
  }

  if (!(await tableExists('order_items'))) {
    await db.schema.createTable('order_items', (table) => {
      table.increments('id').primary();
      table.integer('order_id').notNullable();
      table.integer('product_id').notNullable();
      table.integer('quantity').notNullable().defaultTo(1);
      table.string('selected_size');
      table.foreign('order_id').references('orders.id').onDelete('CASCADE');
      table.foreign('product_id').references('products.id').onDelete('SET NULL');
    });
    console.log('Table order_items créée');
  }

  console.log('Toutes les tables ont été créées ou existaient déjà');
}

// Exécuter la fonction pour créer les tables
createTables()
  .then(() => {
    console.log('Migration terminée avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur pendant la migration:', error);
    process.exit(1);
  });
