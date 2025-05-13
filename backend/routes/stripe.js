const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/database');
const { createOrderAndNotify } = require('../utils/orderUtils');

const router = express.Router();

// Créer une session de checkout
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerEmail } = req.body;
    
    // Formater les items pour Stripe
    const lineItems = items.map(item => {
      // Construire l'URL complète pour l'image si elle est relative
      let imageUrl = null;
      if (item.product.images && item.product.images.length > 0) {
        const imagePath = item.product.images[0];
        if (imagePath.startsWith('/uploads/')) {
          // Utiliser l'URL complète pour Stripe
          imageUrl = `${req.protocol}://${req.get('host')}${imagePath}`;
        } else if (imagePath.startsWith('http')) {
          imageUrl = imagePath;
        }
      }
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${item.product.name} (${item.selectedSize})`,
            description: item.product.description,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Le prix doit être en centimes
        },
        quantity: item.quantity,
      };
    });

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      metadata: {
        order_details: JSON.stringify({
          items: items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize
          }))
        })
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vérifier le statut d'une session
router.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook Stripe
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    return res.status(500).send('Webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Erreur de signature webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestion de l'événement de paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Extraire les métadonnées
      const orderDetails = JSON.parse(session.metadata.order_details);
      
      // Récupérer les détails complets des produits pour la notification
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
      
      // Utiliser notre nouvelle fonction réutilisable
      await createOrderAndNotify({
        items: items,
        customerName: session.customer_details?.name || 'Client Stripe',
        customerEmail: session.customer_email,
        paymentMethod: 'online',
        total: session.amount_total / 100,
        status: 'paid'
      });
      
      console.log('Commande créée avec succès depuis Stripe webhook');
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    }
  }

  res.json({ received: true });
});

module.exports = router;
