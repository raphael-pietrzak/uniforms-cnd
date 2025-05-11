/**
 * Script de test pour l'envoi de messages WhatsApp
 * Usage: NODE_PATH=. node test/testWhatsApp.js
 */

// Charger les variables d'environnement
require('dotenv').config();

// Importer le service WhatsApp
const whatsappService = require('../services/whatsappService');

/**
 * Fonction principale de test
 */
async function runTest() {
  console.log('Démarrage du test d\'envoi WhatsApp...');

  try {
    // Test 1: Envoi d'un message simple
    console.log('Test 1: Envoi d\'un message texte simple');
    await whatsappService.sendMessageToSecretary('Ceci est un message de test depuis le script de test WhatsApp');
    console.log('✓ Message texte envoyé avec succès');

    // Test 2: Notification d'une commande fictive
    console.log('\nTest 2: Envoi d\'une notification de commande');
    const mockOrder = {
      id: 1234,
      customer_name: 'Client Test',
      customer_email: 'test@example.com',
      total: 99.99,
      created_at: new Date().toISOString()
    };

    await whatsappService.notifyNewOrder(mockOrder);
    console.log('✓ Notification de commande envoyée avec succès');

    console.log('\n✅ Tous les tests ont réussi !');
  } catch (error) {
    console.error('\n❌ Échec des tests:', error);
    console.error('Détails de l\'erreur:', error.response?.data || error);
    process.exit(1);
  }
}

// Exécuter le test
runTest()
  .then(() => {
    console.log('\nTests terminés.');
    process.exit(0);
  })
  .catch(err => {
    console.error('\nErreur non gérée:', err);
    process.exit(1);
  });
