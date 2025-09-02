const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require('../config/database');
require('dotenv').config();

// Configuration Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Fonction pour envoyer un message Telegram
async function sendTelegramMessage(chatId, messageText, parseMode = 'Markdown') {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: messageText,
        parse_mode: parseMode,
        reply_markup: {
          inline_keyboard: [[
            {
              text: "✅ Marquer comme collectée",
              callback_data: `collect_order`
            }
          ]]
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message Telegram:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour éditer un message Telegram
async function editTelegramMessage(chatId, messageId, messageText, parseMode = 'Markdown') {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`,
      {
        chat_id: chatId,
        message_id: messageId,
        text: messageText,
        parse_mode: parseMode,
        reply_markup: {
          inline_keyboard: [[
            {
              text: "❌ Annuler la collecte",
              callback_data: `uncollect_order`
            }
          ]]
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'édition du message Telegram:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour formater le résumé d'une commande
function formatOrderSummary(order, isCollected = false) {
  const statusEmoji = isCollected ? '✅' : '📦';
  const statusText = isCollected ? 'COMMANDE COLLECTÉE' : 'NOUVELLE COMMANDE';
  
  // Déterminer le statut de paiement de façon plus claire
  const isOnlinePayment = order.payment_method === 'online';
  const paymentEmoji = isOnlinePayment ? '✅' : '⚠️';
  const paymentStatus = isOnlinePayment ? 'PAYÉE EN LIGNE' : 'NON PAYÉE';
  
  // Convertir le total en nombre et gérer les cas où il pourrait être null/undefined
  const totalAmount = parseFloat(order.total) || 0;
  
  let summary = `${statusEmoji} *${statusText} #${order.id}*\n\n`;
  summary += `👤 *Client:* ${order.customer_name}\n`;
  summary += `📧 *Email:* ${order.customer_email}\n`;
  summary += `${paymentEmoji} *Paiement:* ${paymentStatus}\n`;
  summary += `🏷️ *Total:* ${totalAmount.toFixed(2)}€\n\n`;
  
  summary += `*Articles commandés:*\n`;
  order.items.forEach(item => {
    // Aussi sécuriser le prix du produit
    const itemPrice = parseFloat(item.product.price) || 0;
    summary += `• ${item.quantity}x ${item.product.name} (Taille: ${item.selectedSize}) - ${itemPrice.toFixed(2)}€/unité\n`;
  });
  
  if (!isCollected) {
    summary += `\n💡 Cliquez sur le bouton ci-dessous pour marquer comme collectée`;
  }
  
  return summary;
}

// Envoyer une notification pour une nouvelle commande
async function sendOrderNotification(order) {
  console.log('Envoi de la notification de commande Telegram...');
  const summary = formatOrderSummary(order);
  
  try {
    // Envoyer le message Telegram
    const response = await sendTelegramMessage(TELEGRAM_CHAT_ID, summary);
    
    // Retourner l'ID du message s'il existe
    if (response && response.result && response.result.message_id) {
      return response.result.message_id.toString();
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de commande:', error);
    return null;
  }
}

// Webhook pour recevoir les callbacks Telegram
router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Traitement des callback queries (boutons inline)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const callbackData = callbackQuery.data;
      const messageId = callbackQuery.message.message_id;
      const chatId = callbackQuery.message.chat.id;

      console.log(`Callback reçu: ${callbackData} pour le message ${messageId}`);
      
      // Trouver la commande correspondant au message
      const order = await db('orders')
        .where({ telegram_message_id: messageId.toString() })
        .first();
        
      if (order) {
        if (callbackData === 'collect_order') {
          // Mettre à jour le statut de la commande à "collected"
          console.log('📦 Commande marquée comme collectée via Telegram');
          await db('orders')
            .where({ id: order.id })
            .update({ 
              status: 'collected',
              updated_at: new Date().toISOString()
            });
          
          // Récupérer la commande mise à jour avec ses items
          const updatedOrder = await getOrderWithItems(order.id);
          
          // Éditer le message pour indiquer que la commande est collectée
          const updatedSummary = formatOrderSummary(updatedOrder, true);
          await editTelegramMessage(chatId, messageId, updatedSummary);
          
          // Répondre au callback
          await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
            {
              callback_query_id: callbackQuery.id,
              text: `✅ Commande #${order.id} marquée comme collectée !`,
              show_alert: false
            }
          );
          
        } else if (callbackData === 'uncollect_order') {
          console.log('📦 Commande remise en attente via Telegram');
          
          // Déterminer le nouveau statut en fonction du mode de paiement
          const newStatus = order.payment_method === 'online' ? 'paid' : 'pending';
          
          // Mettre à jour le statut de la commande
          await db('orders')
            .where({ id: order.id })
            .update({ 
              status: newStatus,
              updated_at: new Date().toISOString()
            });
            
          // Récupérer la commande mise à jour avec ses items
          const updatedOrder = await getOrderWithItems(order.id);
          
          // Éditer le message pour remettre l'état initial
          const updatedSummary = formatOrderSummary(updatedOrder, false);
          await editTelegramMessage(chatId, messageId, updatedSummary);
          
          // Répondre au callback
          await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
            {
              callback_query_id: callbackQuery.id,
              text: `⚠️ Commande #${order.id} remise en attente (${newStatus})`,
              show_alert: false
            }
          );
        }
      } else {
        // Répondre au callback si aucune commande n'est trouvée
        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
          {
            callback_query_id: callbackQuery.id,
            text: `⚠️ Aucune commande trouvée pour ce message`,
            show_alert: true
          }
        );
      }
    }
    
    // Toujours répondre 200 OK au webhook
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erreur dans le webhook Telegram:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fonction utilitaire pour récupérer une commande avec ses items
async function getOrderWithItems(orderId) {
  const order = await db('orders').where({ id: orderId }).first();
  const items = await db('order_items')
    .where({ order_id: orderId })
    .join('products', 'order_items.product_id', 'products.id')
    .select(
      'products.*',
      'order_items.quantity',
      'order_items.selected_size'
    );
  
  order.items = items.map(item => ({
    product: {
      id: item.id,
      name: item.name,
      price: item.price,
      images: item.images,
      brand: item.brand,
      condition: item.condition
    },
    quantity: item.quantity,
    selectedSize: item.selected_size
  }));
  
  return order;
}

// Exposer les fonctions pour qu'elles soient utilisables dans d'autres modules
router.sendOrderNotification = sendOrderNotification;
router.sendTelegramMessage = sendTelegramMessage;
router.editTelegramMessage = editTelegramMessage;

module.exports = router;