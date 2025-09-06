const express = require('express');
const axios = require('axios');
const db = require('../config/database');
const { createOrderAndNotify } = require('../utils/orderUtils');
const qs = require('qs');


const router = express.Router();

const SUMUP_API_BASE = 'https://api.sumup.com/v0.1';
const SUMUP_TOKEN_URL = 'https://api.sumup.com/token';


// Obtenir un token d'accès SumUp
async function getSumUpAccessToken() {
  try {
    const response = await axios.post(
      'https://api.sumup.com/token',
      qs.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.SUMUP_CLIENT_ID,
        client_secret: process.env.SUMUP_CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log('response', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error(
      'Erreur lors de l\'obtention du token SumUp:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtenir un token d'accès pour le frontend
router.get('/access-token', async (req, res) => {
  try {
    const accessToken = await getSumUpAccessToken();
    res.json({ access_token: accessToken });
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token SumUp:', error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Créer un checkout SumUp
router.post('/create-checkout', async (req, res) => {
  try {
    const { items, customerEmail } = req.body;
    
    // Calculer le montant total
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const accessToken = await getSumUpAccessToken();
    
    // Créer une description des articles
    const description = items.map(item => 
      `${item.product.name} (${item.selectedSize}) x${item.quantity}`
    ).join(', ');

    // Créer le checkout
    const checkoutData = {
      checkout_reference: `order_${Date.now()}`,
      amount: totalAmount.toFixed(2),
      currency: 'EUR',
      pay_to_email: process.env.SUMUP_MERCHANT_EMAIL,
      description: description,
      return_url: `${req.headers.origin}/checkout-success`,
      cancel_url: `${req.headers.origin}/cart`,
      customer_email: customerEmail || "test@example.com"
    };

    const response = await axios.post(`${SUMUP_API_BASE}/checkouts`, checkoutData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Stocker les détails de la commande temporairement avec l'ID du checkout
    await db('temp_orders').insert({
      checkout_id: response.data.id,
      order_details: JSON.stringify({
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize
        })),
        customerEmail,
        totalAmount
      }),
      created_at: new Date()
    });


    console.log('Checkout SumUp créé:', response.data);
    res.json({ 
      id: response.data.id, 
      url: `https://api.sumup.com/v0.1/checkouts/${response.data.id}` 
    });
  } catch (error) {
    console.error('Erreur SumUp:', error);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Vérifier le statut d'un checkout
router.get('/checkout/:checkoutId', async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const accessToken = await getSumUpAccessToken();
    
    const response = await axios.get(`${SUMUP_API_BASE}/checkouts/${checkoutId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Webhook SumUp
router.post('/webhook', async (req, res) => {
  try {
    const { event_type, resource_type, resource } = req.body;
    
    // Vérifier que c'est un événement de paiement réussi
    if (event_type === 'PAYMENT_SUCCESSFUL' && resource_type === 'TXN') {
      const checkoutId = resource.checkout_reference;
      
      // Récupérer les détails de la commande temporaire
      const tempOrder = await db('temp_orders')
        .where('checkout_id', checkoutId)
        .first();
      
      if (tempOrder) {
        const orderDetails = JSON.parse(tempOrder.order_details);
        
        // Récupérer les détails complets des produits
        const items = await Promise.all(orderDetails.items.map(async (item) => {
          const product = await db('products').where('id', item.product_id).first();
          return {
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images
            },
            quantity: item.quantity,
            selectedSize: item.selectedSize
          };
        }));
        
        // Créer la commande
        await createOrderAndNotify({
          items: items,
          customerName: resource.customer?.name || 'Client SumUp',
          customerEmail: orderDetails.customerEmail,
          paymentMethod: 'online',
          total: orderDetails.totalAmount,
          status: 'paid'
        });
        
        // Supprimer la commande temporaire
        await db('temp_orders').where('checkout_id', checkoutId).del();
        
        console.log('Commande créée avec succès depuis SumUp webhook');
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook SumUp:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
