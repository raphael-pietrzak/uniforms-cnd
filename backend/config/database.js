const knex = require('knex');
const path = require('path');

// Configuration de Knex avec SQLite
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db.sqlite')
  },
  useNullAsDefault: true
});

module.exports = db;
