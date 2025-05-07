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
      table.boolean('inStock').defaultTo(true);
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
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('order_items', function(table) {
      table.increments('id').primary();
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.integer('quantity').notNullable();
      table.string('selected_size').notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('order_items')
    .dropTable('orders')
    .dropTable('products');
};
