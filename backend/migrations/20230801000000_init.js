exports.up = function(knex) {
  return knex.schema
    .createTable('products', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.json('sizes');
      table.string('condition');
      table.string('brand');
      table.string('gender');
      table.json('images');
      table.string('category');
      table.timestamps(true, true);
    })
    .createTable('orders', function(table) {
      table.increments('id').primary();
      table.decimal('total', 10, 2).notNullable();
      table.string('status').notNullable();
      table.string('payment_method').notNullable();
      table.string('customer_name').notNullable();
      table.string('customer_email').notNullable();
      table.string('whatsapp_message_id');
      table.timestamp('notification_sent_at');
      table.timestamps(true, true);
    })
    .createTable('order_items', function(table) {
      table.increments('id').primary();
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.integer('quantity').notNullable();
      table.string('selected_size').notNullable();
    })
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.string('email').notNullable().unique();
      table.string('role').defaultTo('user'); // user, admin
      table.timestamps(true, true);
    })
    // Création de la table pour les refresh tokens
    .createTable('refresh_tokens', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.string('token', 255).notNullable().unique();
      table.timestamp('created_at').notNullable();
      table.index(['user_id', 'token']);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('order_items')
    .dropTable('orders')
    .dropTable('users')
    .dropTable('products');
};
