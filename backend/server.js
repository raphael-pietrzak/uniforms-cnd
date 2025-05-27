const express = require('express');
const axios = require('axios');
const router = express.Router();

const token = process.env.WHATSAPP_TOKEN;
const fromPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const to = process.env.SECRETARY_PHONE_NUMBER;

// 📨 ENVOYER UN MESSAGE TEXTE
async function sendMessage(messageText) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${fromPhoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: messageText },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Message envoyé :', response.data);
  } catch (error) {
    console.error('Erreur lors de l\'envoi :', error.response?.data || error.message);
  }
}

// Exposer le webhook pour recevoir les messages
router.post('/webhook', (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (message) {
    const msgType = message.type;

    if (msgType === 'text') {
      console.log('📩 Message texte reçu :', message.text.body);
      sendMessage(`Merci pour votre message : "${message.text.body}"`);
    } else if (msgType === 'reaction') {
      console.log('💬 Réaction reçue :', message.reaction.emoji);
      console.log('🧾 Réagit à :', message.reaction.message_id);
      handleReaction(message.reaction);
    } else {
      console.log(`📦 Message reçu de type ${msgType}`, message);
    }
  } else {
    console.log('⚠️ Webhook reçu sans message.');
  }

  res.sendStatus(200);
});

// cases reactions
function handleReaction(reaction) {
  const reactionType = reaction.type;
  const emoji = reaction.emoji;

  if (emoji === '👍') {
    sendMessage(`Merci pour votre réaction positive : ${emoji}`);
  } else if (emoji === '👎') {
    sendMessage(`Merci pour votre réaction négative : ${emoji}`);
  } else {
    sendMessage(`Merci pour votre réaction : "${emoji}"`);
  }
}

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

module.exports = router;