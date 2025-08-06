const express = require('express');
const db = require('../config/database');
const { createOrderAndNotify } = require('../utils/orderUtils');
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
    
    // Utilisation de la nouvelle fonction réutilisable
    const result = await createOrderAndNotify({
      items,
      customerName,
      customerEmail,
      paymentMethod,
      total,
      status
    });
    
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

// Supprimer une commande
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db('orders').where({ id }).first();
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    // Supprimer les items de la commande
    await db('order_items').where({ order_id: id }).delete();
    // Supprimer la commande
    await db('orders').where({ id }).delete();
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
