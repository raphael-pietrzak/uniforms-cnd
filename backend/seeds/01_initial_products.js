exports.seed = async function(knex) {
  // Vider les tables existantes
  await knex('order_items').del();
  await knex('orders').del();
  await knex('products').del();
  
  // Préparer tous les produits de sample
  const sampleProducts = [
    {
      name: 'Polo avec Logo de l\'École',
      description: 'Polo classique avec logo de l\'école brodé. Fabriqué à partir de tissu durable en mélange de coton.',
      price: 15.99,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      condition: 'new',
      brand: 'SchoolWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      inStock: true,
      category: 'tops'
    },
    {
      name: 'Jupe Plissée',
      description: 'Jupe plissée bleu marine avec taille ajustable. Parfaite pour l\'usage quotidien à l\'école.',
      price: 24.99,
      sizes: JSON.stringify(['S', 'M', 'L']),
      condition: 'new',
      brand: 'SchoolWear',
      gender: 'girls',
      images: JSON.stringify([
        'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      inStock: true,
      category: 'bottoms'
    },
    {
      name: 'Pantalon Chino',
      description: 'Pantalon chino confortable en bleu marine. Parfait pour l\'uniforme scolaire.',
      price: 29.99,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      condition: 'new',
      brand: 'SchoolWear',
      gender: 'boys',
      images: JSON.stringify([
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      inStock: true,
      category: 'bottoms'
    },
    {
      name: 'Cardigan Scolaire',
      description: 'Cardigan chaud bleu marine avec logo de l\'école. Parfait pour les journées fraîches.',
      price: 34.99,
      sizes: JSON.stringify(['S', 'M', 'L']),
      condition: 'used',
      brand: 'SchoolWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/6501787/pexels-photo-6501787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/6501787/pexels-photo-6501787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      inStock: true,
      category: 'outerwear'
    },
    {
      name: 'Blazer Scolaire',
      description: 'Blazer formel bleu marine avec écusson de l\'école. Obligatoire pour les événements scolaires formels.',
      price: 59.99,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      condition: 'new',
      brand: 'PremiumSchoolWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      inStock: true,
      category: 'outerwear'
    },
    {
      name: 'T-shirt d\'EPS',
      description: 'T-shirt respirant de sport avec logo de l\'école. Parfait pour les cours d\'éducation physique.',
      price: 12.99,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      condition: 'new',
      brand: 'SportWear',
      gender: 'unisex',
      images: JSON.stringify([
        'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      ]),
      inStock: true,
      category: 'sportswear'
    }
  ];
  
  // Insérer les produits
  await knex('products').insert(sampleProducts);
};
