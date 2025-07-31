const express = require('express');
const db = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await db('products').select('*');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db('products').where({ id: req.params.id }).first();
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un produit (protégé par authentification)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [result] = await db('products')
      .insert({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        sizes: req.body.sizes,
        condition: req.body.condition,
        brand: req.body.brand,
        gender: req.body.gender,
        images: req.body.images,
        inStock: req.body.inStock,
        category: req.body.category,
        created_at: new Date().toISOString()
      })
      .returning('*');
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un produit (protégé par authentification)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    await db('products').where({ id: req.params.id }).update(updateData);
    const updatedProduct = await db('products').where({ id: req.params.id }).first();
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un produit (protégé par authentification)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedCount = await db('products').where({ id: req.params.id }).del();
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
