exports.up = function(knex) {
  return knex.schema
    // Amélioration de la table users
    .alterTable('users', table => {
      // Ajouter un champ pour stocker la dernière connexion
      table.timestamp('last_login').nullable();
      // Ajouter un champ pour suivre les tentatives de connexion échouées
      table.integer('failed_login_attempts').defaultTo(0);
      // Ajouter un champ pour bloquer temporairement un compte
      table.timestamp('locked_until').nullable();
      // Ajouter un champ pour le statut du compte
      table.enu('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    })

    // Création de la table pour les tokens de réinitialisation de mot de passe
    .createTable('password_reset_tokens', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.string('token', 255).notNullable().unique();
      table.timestamp('expires_at').notNullable();
      table.boolean('used').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index(['token', 'expires_at']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('password_reset_tokens')
    .dropTableIfExists('refresh_tokens')
    .alterTable('users', table => {
      table.dropColumn('last_login');
      table.dropColumn('failed_login_attempts');
      table.dropColumn('locked_until');
      table.dropColumn('status');
      table.dropColumn('updated_at');
    });
};