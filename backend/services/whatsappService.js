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
          type: 'text',
          text: {
            body: message
          }
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
   * Envoie un message utilisant un template WhatsApp
   * @param {string} templateName - Nom du template
   * @param {Array} components - Composants et paramètres du template
   * @returns {Promise} - La réponse de l'API WhatsApp
   */
  async sendTemplateMessage(templateName, components = []) {
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
            name: templateName,
            language: { code: "fr" },
            components: components
          }
        }
      });

      console.log('Message WhatsApp avec template envoyé avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message WhatsApp avec template:', error.response?.data || error.message);
      throw new Error('Échec de l\'envoi du message WhatsApp avec template');
    }
  }

  /**
   * Notifie la secrétaire d'une nouvelle commande
   * @param {object} order - Les détails de la commande
   */
  async notifyNewOrder(order) {
    // Utilisation du template "order_management_1"
    const components = [
      {
        type: "body",
        parameters: [
          { type: "text", text: order.id },
          { type: "text", text: order.customer_name },
          { type: "text", text: order.customer_email },
          { type: "text", text: order.total },
          { type: "text", text: new Date(order.created_at).toLocaleDateString('fr-FR') }
        ]
      }
    ];
    
    return this.sendTemplateMessage("order_management_1", components);
  }
}

module.exports = new WhatsAppService();
