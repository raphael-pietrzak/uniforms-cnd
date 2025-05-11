const axios = require('axios');

/**
 * Service pour envoyer des messages WhatsApp via l'API Meta
 */
class WhatsAppService {
  constructor() {
    this.token = process.env.WHATSAPP_TOKEN;
    this.apiUrl = 'https://graph.facebook.com/v22.0/';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '170996272676747';
    this.secretaryPhoneNumber = process.env.SECRETARY_PHONE_NUMBER || '33683392370';
  }

  /**
   * Envoie un message texte à la secrétaire
   * @param {string} message - Le message à envoyer
   * @returns {Promise} - La réponse de l'API WhatsApp
   */
  async sendMessageToSecretary(message) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.apiUrl}${this.phoneNumberId}/messages`,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        data: {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: this.secretaryPhoneNumber,
          type: "template",
          template: {
              name: "order_management_1",
          },
        }
      });

      console.log('Message WhatsApp envoyé avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message WhatsApp:', error.response?.data || error.message);
      throw new Error('Échec de l\'envoi du message WhatsApp');
    }
  }

  /**
   * Notifie la secrétaire d'une nouvelle commande
   * @param {object} order - Les détails de la commande
   */
  async notifyNewOrder(order) {
    const message = `📦 Nouvelle commande reçue !\n\n` +
      `ID: ${order.id}\n` +
      `Client: ${order.customer_name}\n` +
      `Email: ${order.customer_email}\n` +
      `Total: ${order.total}€\n` +
      `Date: ${new Date(order.created_at).toLocaleDateString('fr-FR')}\n\n` +
      `Connectez-vous au tableau de bord pour voir les détails.`;
    
    return this.sendMessageToSecretary(message);
  }
}

module.exports = new WhatsAppService();
