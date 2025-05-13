const express = require('express');
const db = require('../config/database');
const whatsappRoutes = require('./whatsapp'); // Importer les routes WhatsApp

const router = express.Router();

// Récupérer toutes les commandes
router.get('/', async (req, res) => {
  try {
    const orders = await db('orders').select('*');
    
    // Pour chaque commande, récupérer les items associés
    for (const order of orders) {
      const items = await db('order_items')
        .where({ order_id: order.id })
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
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une commande par ID
router.get('/:id', async (req, res) => {
  try {
    const order = await db('orders').where({ id: req.params.id }).first();
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    // Récupérer les items de la commande
    const items = await db('order_items')
      .where({ order_id: order.id })
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
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer une commande
router.post('/', async (req, res) => {
  try {
    const { items, customerName, customerEmail, paymentMethod, total, status } = req.body;
    
    // Démarrer une transaction pour garantir l'intégrité
    const result = await db.transaction(async trx => {
      // Insérer la commande
      const [orderId] = await trx('orders').insert({
        customer_name: customerName,
        customer_email: customerEmail,
        payment_method: paymentMethod,
        total,
        status
      });
      
      // Insérer les items de commande
      const orderItemsToInsert = items.map(item => ({
        order_id: orderId,
        product_id: item.product.id,
        quantity: item.quantity,
        selected_size: item.selectedSize
      }));
      
      await trx('order_items').insert(orderItemsToInsert);
      
      // Retourner la commande complète
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
      
      return newOrder;
    });
    
    // Envoyer une notification WhatsApp pour la nouvelle commande
    try {
      await whatsappRoutes.sendOrderNotification(result);
    } catch (notifError) {
      console.error('Erreur lors de l\'envoi de la notification WhatsApp:', notifError);
      // On continue même si la notification échoue
    }
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le statut d'une commande
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Le statut est requis' });
    }
    
    // Valider que le statut est valide
    const validStatuses = ['pending', 'paid', 'ready', 'collected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
    
    // Mettre à jour le statut de la commande
    await db('orders').where({ id }).update({ 
      status,
      updated_at: new Date().toISOString()
    });
    
    // Récupérer la commande mise à jour
    const updatedOrder = await db('orders').where({ id }).first();
    
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    // Récupérer les items de la commande
    const items = await db('order_items')
      .where({ order_id: id })
      .join('products', 'order_items.product_id', 'products.id')
      .select(
        'products.*',
        'order_items.quantity',
        'order_items.selected_size'
      );
    
    updatedOrder.items = items.map(item => ({
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
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
