exports.seed = async function(knex) {
  // Vider les tables existantes
  await knex('order_items').del();
  await knex('orders').del();
  await knex('product_inventory').del();
  await knex('products').del();
  
  // Préparer tous les produits de sample
  const sampleProducts = [
    {
      name: 'Polo avec Logo de l\'École',
      description: 'Polo classique avec logo de l\'école brodé. Fabriqué à partir de tissu durable en mélange de coton.',
      price: 15.99,
      condition: 'new',
      brand: 'SchoolWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      category: 'tops'
    },
    {
      name: 'Jupe Plissée',
      description: 'Jupe plissée bleu marine avec taille ajustable. Parfaite pour l\'usage quotidien à l\'école.',
      price: 24.99,
      condition: 'new',
      brand: 'SchoolWear',
      gender: 'girls',
      images: JSON.stringify([
        'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      category: 'bottoms'
    },
    {
      name: 'Pantalon Chino',
      description: 'Pantalon chino confortable en bleu marine. Parfait pour l\'uniforme scolaire.',
      price: 29.99,
      condition: 'new',
      brand: 'SchoolWear',
      gender: 'boys',
      images: JSON.stringify([
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      category: 'bottoms'
    },
    {
      name: 'Cardigan Scolaire',
      description: 'Cardigan chaud bleu marine avec logo de l\'école. Parfait pour les journées fraîches.',
      price: 34.99,
      condition: 'used',
      brand: 'SchoolWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/6501787/pexels-photo-6501787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/6501787/pexels-photo-6501787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      category: 'outerwear'
    },
    {
      name: 'Blazer Scolaire',
      description: 'Blazer formel bleu marine avec écusson de l\'école. Obligatoire pour les événements scolaires formels.',
      price: 59.99,
      condition: 'new',
      brand: 'PremiumSchoolWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      category: 'outerwear'
    },
    {
      name: 'T-shirt d\'EPS',
      description: 'T-shirt respirant de sport avec logo de l\'école. Parfait pour les cours d\'éducation physique.',
      price: 12.99,
      condition: 'new',
      brand: 'SportWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      category: 'sportswear'
    }
  ];
  
  // Insérer les produits
  const insertedProducts = await knex('products').insert(sampleProducts).returning('id');
  
  // Créer l'inventaire pour chaque produit
  const inventoryData = [];
  
  // Pour chaque produit, ajouter différentes tailles avec du stock
  insertedProducts.forEach((productId, index) => {
    const id = typeof productId === 'object' ? productId.id : productId;
    
    switch(index) {
      case 0: // Polo avec Logo de l'École
        inventoryData.push(
          { product_id: id, size: 'S', quantity: 15 },
          { product_id: id, size: 'M', quantity: 20 },
          { product_id: id, size: 'L', quantity: 18 },
          { product_id: id, size: 'XL', quantity: 12 }
        );
        break;
      case 1: // Jupe Plissée
        inventoryData.push(
          { product_id: id, size: 'XS', quantity: 8 },
          { product_id: id, size: 'S', quantity: 12 },
          { product_id: id, size: 'M', quantity: 15 },
          { product_id: id, size: 'L', quantity: 10 }
        );
        break;
      case 2: // Pantalon Chino
        inventoryData.push(
          { product_id: id, size: 'S', quantity: 10 },
          { product_id: id, size: 'M', quantity: 16 },
          { product_id: id, size: 'L', quantity: 14 },
          { product_id: id, size: 'XL', quantity: 8 }
        );
        break;
      case 3: // Cardigan Scolaire
        inventoryData.push(
          { product_id: id, size: 'S', quantity: 6 },
          { product_id: id, size: 'M', quantity: 9 },
          { product_id: id, size: 'L', quantity: 8 },
          { product_id: id, size: 'XL', quantity: 5 }
        );
        break;
      case 4: // Blazer Scolaire
        inventoryData.push(
          { product_id: id, size: 'S', quantity: 4 },
          { product_id: id, size: 'M', quantity: 7 },
          { product_id: id, size: 'L', quantity: 6 },
          { product_id: id, size: 'XL', quantity: 3 }
        );
        break;
      case 5: // T-shirt d'EPS
        inventoryData.push(
          { product_id: id, size: 'S', quantity: 20 },
          { product_id: id, size: 'M', quantity: 25 },
          { product_id: id, size: 'L', quantity: 22 },
          { product_id: id, size: 'XL', quantity: 15 }
        );
        break;
    }
  });
  
  // Insérer l'inventaire
  await knex('product_inventory').insert(inventoryData);
};
