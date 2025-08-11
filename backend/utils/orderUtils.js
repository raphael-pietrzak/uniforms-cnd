const db = require('../config/database');
const whatsappRoutes = require('../routes/whatsapp');
const nodemailer = require('nodemailer');

/**
 * Fonction pour envoyer un email de confirmation de commande
 * @param {Object} order - L'objet commande complet
 * @returns {Promise<string>} - Identifiant du message envoyé
 */
async function sendOrderConfirmationEmail(order) {
  try {
    // Configuration du transporteur d'email pour Gmail avec mot de passe d'application
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Utiliser le mot de passe d'application Gmail
      },
    });

    // Formatter les articles pour l'email
    const itemsList = order.items.map(item => 
      `- ${item.product.name} (Taille: ${item.selectedSize}) - Quantité: ${item.quantity} - Prix unitaire: ${item.product.price}€`
    ).join('\n');

    // Construire le contenu de l'email
    const emailContent = {
      from: `"CND Uniformes" <${process.env.EMAIL_USER}>`,
      to: order.customer_email,
      subject: `Confirmation de votre commande #${order.id}`,
      text: `Bonjour ${order.customer_name},

Nous vous remercions pour votre commande #${order.id}.

Détails de votre commande:
${itemsList}

Total: ${order.total}€
Méthode de paiement: ${order.payment_method === 'online' ? 'Paiement en ligne' : 'Paiement à la livraison'}
Statut: ${order.status}

Nous vous tiendrons informé(e) de l'avancement de votre commande.

Cordialement,
L'équipe CND Uniformes`,
      html: `<h2>Bonjour ${order.customer_name},</h2>
<p>Nous vous remercions pour votre commande <strong>#${order.id}</strong>.</p>
<h3>Détails de votre commande:</h3>
<ul>
${order.items.map(item => `<li><strong>${item.product.name}</strong> (Taille: ${item.selectedSize}) - Quantité: ${item.quantity} - Prix unitaire: ${item.product.price}€</li>`).join('')}
</ul>
<p><strong>Total:</strong> ${order.total}€</p>
<p><strong>Méthode de paiement:</strong> ${order.payment_method === 'online' ? 'Paiement en ligne' : 'Paiement à la livraison'}</p>
<p><strong>Statut:</strong> ${order.status}</p>
<p>Nous vous tiendrons informé(e) de l'avancement de votre commande.</p>
<p>Cordialement,<br>L'équipe CND Uniformes</p>`
    };

    // Envoyer l'email
    const info = await transporter.sendMail(emailContent);
    console.log('Email de confirmation envoyé:', info.messageId);
    return info.messageId;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    throw error;
  }
}

/**
 * Fonction réutilisable pour créer une commande et envoyer une notification WhatsApp
 * @param {Object} orderData - Données de la commande
 * @param {Array} orderData.items - Articles de la commande
 * @param {string} orderData.customerName - Nom du client
 * @param {string} orderData.customerEmail - Email du client
 * @param {string} orderData.paymentMethod - Méthode de paiement ('online' ou 'delivery')
 * @param {number} orderData.total - Montant total de la commande
 * @param {string} orderData.status - Statut initial de la commande
 * @returns {Promise<Object>} La commande créée avec toutes ses informations
 */
async function createOrderAndNotify(orderData) {
  const { items, customerName, customerEmail, paymentMethod, total, status } = orderData;
  
  try {
    // Vérifier que items est bien un tableau
    if (!Array.isArray(items)) {
      throw new Error('Les articles doivent être fournis sous forme de tableau');
    }
    
    // Démarrer une transaction pour garantir l'intégrité
    const result = await db.transaction(async trx => {
      // Insérer la commande
      const orderId = await trx('orders').insert({
        customer_name: customerName,
        customer_email: customerEmail,
        payment_method: paymentMethod,
        total,
        status: status || 'pending'
      }).returning(['id']).then(ids => ids[0].id);
      
      // Vérifier que chaque item a les propriétés nécessaires
      const orderItemsToInsert = items.map(item => {
        if (!item.product || !item.product.id || !item.quantity || !item.selectedSize) {
          throw new Error('Format d\'article invalide - Chaque article doit avoir product.id, quantity et selectedSize');
        }
        
        return {
          order_id: orderId,
          product_id: item.product.id,
          quantity: item.quantity,
          selected_size: item.selectedSize
        };
      });
      
      await trx('order_items').insert(orderItemsToInsert);
      
      // Mettre à jour le stock pour chaque article commandé
      for (const item of items) {
        // Récupérer les informations d'inventaire actuelles
        const inventoryItem = await trx('product_inventory')
          .where({
            product_id: item.product.id,
            size: item.selectedSize
          })
          .first();
          
        if (!inventoryItem) {
          console.warn(`Inventaire non trouvé pour le produit ${item.product.id} en taille ${item.selectedSize}`);
          continue;
        }
        
        // Calculer la nouvelle quantité
        const newQuantity = Math.max(0, inventoryItem.quantity - item.quantity);
        
        // Mettre à jour l'inventaire
        await trx('product_inventory')
          .where({
            product_id: item.product.id,
            size: item.selectedSize
          })
          .update({ quantity: newQuantity });
          
        console.log(`Stock mis à jour pour ${item.product.id} taille ${item.selectedSize}: ${inventoryItem.quantity} -> ${newQuantity}`);
      }
      
      // Récupérer la commande complète
      const newOrder = await trx('orders').where({ id: orderId }).first();
      const orderItems = await trx('order_items')
        .where({ order_id: orderId })
        .join('products', 'order_items.product_id', 'products.id')
        .select(
          'products.*',
          'order_items.quantity',
          'order_items.selected_size'
        );
      
      newOrder.items = orderItems.map(item => ({
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
      
      // Envoyer une notification WhatsApp et récupérer l'ID du message
      try {
        const whatsappMessageId = await whatsappRoutes.sendOrderNotification(newOrder);
        
        // Mettre à jour la commande avec l'ID du message WhatsApp
        if (whatsappMessageId) {
          await trx('orders').where({ id: orderId }).update({
            whatsapp_message_id: whatsappMessageId,
            notification_sent_at: new Date().toISOString()
          });
          newOrder.whatsapp_message_id = whatsappMessageId;
          newOrder.notification_sent_at = new Date().toISOString();
        }
      } catch (notifError) {
        console.error('Erreur lors de l\'envoi de la notification WhatsApp:', notifError);
        // On continue même si la notification échoue
      }
      
      // Envoyer un email de confirmation au client
      try {
        const emailMessageId = await sendOrderConfirmationEmail(newOrder);
        if (emailMessageId) {
          await trx('orders').where({ id: orderId }).update({
            email_message_id: emailMessageId,
            email_sent_at: new Date().toISOString()
          });
          newOrder.email_message_id = emailMessageId;
          newOrder.email_sent_at = new Date().toISOString();
        }
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
        // On continue même si l'envoi d'email échoue
      }
      
      return newOrder;
    });
    
    return result;
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    throw error;
  }
}

module.exports = {
  createOrderAndNotify,
  sendOrderConfirmationEmail
};
