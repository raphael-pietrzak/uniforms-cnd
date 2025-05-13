const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require('../config/database');
require('dotenv').config();

// Configuration WhatsApp
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const SECRETARY_PHONE_NUMBER = process.env.SECRETARY_PHONE_NUMBER;

// Fonction pour envoyer un message WhatsApp
async function sendWhatsAppMessage(to, messageText) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: messageText },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour formater le résumé d'une commande
function formatOrderSummary(order) {
    const paymentMethod = order.payment_method === 'online' ? 'En ligne' : 'À la livraison';
  let summary = `📦 *NOUVELLE COMMANDE #${order.id}*\n\n`;
  summary += `👤 *Client:* ${order.customer_name}\n`;
  summary += `📧 *Email:* ${order.customer_email}\n`;
  summary += `💳 *Méthode de paiement:* ${paymentMethod}\n`;
  summary += `🏷️ *Total:* ${order.total.toFixed(2)}€\n\n`;
  
  summary += `*Articles commandés:*\n`;
  order.items.forEach(item => {
    summary += `• ${item.quantity}x ${item.product.name} (Taille: ${item.selectedSize}) - ${item.product.price.toFixed(2)}€/unité\n`;
  });
  
  summary += `\nPour marquer comme collectée, réagissez avec 👍`;
  
  return summary;
}

// Envoyer une notification pour une nouvelle commande
async function sendOrderNotification(order) {
    console.log('Envoi de la notification de commande WhatsApp...');
  const summary = formatOrderSummary(order);
  
  try {
    // Envoyer le message WhatsApp
    const response = await sendWhatsAppMessage(SECRETARY_PHONE_NUMBER, summary);
    console.log('Message envoyé avec succès:', response);
    
    // Retourner l'ID du message s'il existe
    if (response && response.messages && response.messages[0]) {
        console.log('ID du message WhatsApp:', response.messages[0].id);
        return response.messages[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de commande:', error);
    return null;
  }
}

// Webhook pour recevoir les messages WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    console.log('Reçu un message sur le webhook WhatsApp');
        const data = req.body;
    
        
      const entry = data.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;
      
      if (messages && messages.length > 0) {
        const message = messages[0];
        
        // Traitement des réactions
        if (message.type === 'reaction') {
          const reaction = message.reaction;
          const emoji = reaction.emoji;
          const originalMessageId = reaction.message_id;
          
          // Si c'est un pouce en l'air, mettre à jour le statut de la commande
          console.log('💬 Réaction reçue :', emoji);
          if (emoji === '👍') {
            // Trouver la commande correspondant au message original
            const order = await db('orders')
              .where({ whatsapp_message_id: originalMessageId })
              .first();
            
            if (order) {
              // Mettre à jour le statut de la commande à "collected"
              await db('orders')
                .where({ id: order.id })
                .update({ 
                  status: 'collected',
                });
              
              // Confirmer que la commande a été marquée comme collectée
              await sendWhatsAppMessage(
                SECRETARY_PHONE_NUMBER, 
                `✅ La commande #${order.id} pour ${order.customer_name} a été marquée comme collectée.`
              );
            } else {
                await sendWhatsAppMessage(
                    SECRETARY_PHONE_NUMBER, 
                    `⚠️ Aucune commande trouvée pour le message ID ${originalMessageId}.`
                    );
            }
          }
        } else if (message.type === 'text') {
            const text = message.text.body;
            const senderId = message.from;

            console.log('📩 Message texte reçu :', text);
            
            // Répondre au message texte
            await sendWhatsAppMessage(SECRETARY_PHONE_NUMBER, `Merci pour votre message : "${text}"`);
        }
    }
    
    // Toujours répondre 200 OK au webhook
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erreur dans le webhook WhatsApp:', error);
    res.status(500).json({ error: error.message });
  }
});


// Vérification du webhook (nécessaire pour Meta)
router.get('/webhook', (req, res) => {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
  
    if (mode && token === verifyToken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

// Exposer la fonction de notification pour qu'elle soit utilisable dans d'autres modules
router.sendOrderNotification = sendOrderNotification;
router.sendWhatsAppMessage = sendWhatsAppMessage;

module.exports = router;
