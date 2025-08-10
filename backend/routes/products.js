const express = require('express');
const db = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await db('products').select('*');
    
    // Récupérer l'inventaire pour chaque produit
    for (let product of products) {
      const inventory = await db('product_inventory')
        .where({ product_id: product.id })
        .select('size', 'quantity');
      
      product.inventory = inventory;
      
      // Calculer si le produit est en stock (au moins une taille disponible)
      product.inStock = inventory.some(item => item.quantity > 0);
    }
    
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
    
    // Récupérer l'inventaire pour ce produit
    const inventory = await db('product_inventory')
      .where({ product_id: product.id })
      .select('size', 'quantity');
    
    product.inventory = inventory;
    
    // Calculer si le produit est en stock (au moins une taille disponible)
    product.inStock = inventory.some(item => item.quantity > 0);
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un produit (protégé par authentification)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const trx = await db.transaction();
  
  try {
    // Extraire l'inventaire de la requête
    const { inventory, ...productData } = req.body;
    
    // Insérer d'abord le produit
    const [product] = await trx('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sizes: productData.sizes,
        condition: productData.condition,
        brand: productData.brand,
        gender: productData.gender,
        images: productData.images,
        category: productData.category,
        created_at: new Date().toISOString()
      })
      .returning('*');
    
    // Insérer ensuite l'inventaire si fourni
    if (inventory && Array.isArray(inventory) && inventory.length > 0) {
      const inventoryItems = inventory.map(item => ({
        product_id: product.id,
        size: item.size,
        quantity: item.quantity,
        created_at: new Date().toISOString()
      }));
      
      await trx('product_inventory').insert(inventoryItems);
    }
    
    await trx.commit();
    
    // Récupérer l'inventaire fraîchement créé
    product.inventory = await db('product_inventory')
      .where({ product_id: product.id })
      .select('size', 'quantity');
    
    // Calculer si le produit est en stock
    product.inStock = product.inventory.some(item => item.quantity > 0);
    
    res.status(201).json(product);
  } catch (error) {
    await trx.rollback();
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un produit (protégé par authentification)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const trx = await db.transaction();
  
  try {
    // Extraire l'inventaire de la requête
    const { inventory, ...productData } = req.body;
    
    // Mettre à jour le produit
    const updateData = {
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    await trx('products').where({ id: req.params.id }).update(updateData);
    
    // Mettre à jour l'inventaire si fourni
    if (inventory && Array.isArray(inventory)) {
      // Supprimer l'ancien inventaire
      await trx('product_inventory').where({ product_id: req.params.id }).del();
      
      // Ajouter le nouvel inventaire
      if (inventory.length > 0) {
        const inventoryItems = inventory.map(item => ({
          product_id: req.params.id,
          size: item.size,
          quantity: item.quantity,
          created_at: new Date().toISOString()
        }));
        
        await trx('product_inventory').insert(inventoryItems);
      }
    }
    
    await trx.commit();
    
    // Récupérer le produit mis à jour avec son inventaire
    const updatedProduct = await db('products').where({ id: req.params.id }).first();
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Récupérer l'inventaire mis à jour
    updatedProduct.inventory = await db('product_inventory')
      .where({ product_id: updatedProduct.id })
      .select('size', 'quantity');
    
    // Calculer si le produit est en stock
    updatedProduct.inStock = updatedProduct.inventory.some(item => item.quantity > 0);
    
    res.json(updatedProduct);
  } catch (error) {
    await trx.rollback();
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un produit (protégé par authentification)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // L'inventaire sera automatiquement supprimé grâce à la contrainte ON DELETE CASCADE
    const deletedCount = await db('products').where({ id: req.params.id }).del();
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le stock d'un produit pour une taille spécifique
router.patch('/:id/inventory/:size', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id, size } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ error: 'La quantité doit être un nombre entier positif' });
    }
    
    // Vérifier si le produit existe
    const product = await db('products').where({ id }).first();
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Vérifier si l'entrée d'inventaire existe
    const inventoryItem = await db('product_inventory')
      .where({ product_id: id, size })
      .first();
    
    if (inventoryItem) {
      // Mettre à jour l'entrée existante
      await db('product_inventory')
        .where({ product_id: id, size })
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        });
    } else {
      // Créer une nouvelle entrée
      await db('product_inventory').insert({
        product_id: id,
        size,
        quantity,
        created_at: new Date().toISOString()
      });
    }
    
    // Récupérer l'inventaire mis à jour
    const updatedInventory = await db('product_inventory')
      .where({ product_id: id })
      .select('size', 'quantity');
    
    res.json({
      message: 'Inventaire mis à jour avec succès',
      inventory: updatedInventory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
