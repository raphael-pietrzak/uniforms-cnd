// seeds users.js

const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Truncate table to ensure we don't have duplicates
  await knex('users').del();
  
  // Create default admin and regular user
  const salt = 10;
  const adminPassword = await bcrypt.hash('admin123', salt);
  const userPassword = await bcrypt.hash('user123', salt);
  
  return knex('users').insert([
    {
      username: 'admin',
      password: adminPassword,
      email: 'admin@cnduniformes.com',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      username: 'utilisateur',
      password: userPassword,
      email: 'user@cnduniformes.com',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};