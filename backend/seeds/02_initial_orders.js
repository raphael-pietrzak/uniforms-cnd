exports.seed = async function(knex) {
  // Vider les tables existantes
  await knex('order_items').del();
  await knex('orders').del();
  
  // Récupérer les IDs des produits existants pour référence
  const products = await knex('products').select('id');
  
  // Créer des commandes d'exemple
  const orders = [
    {
      total: 55.97,
      status: 'collected',
      payment_method: 'credit_card',
      customer_name: 'Jean Dupont',
      customer_email: 'jean.dupont@example.com',
      created_at: new Date('2023-09-15T10:30:00')
    },
    {
      total: 24.99,
      status: 'pending',
      payment_method: 'paypal',
      customer_name: 'Marie Martin',
      customer_email: 'marie.martin@example.com',
      created_at: new Date('2023-09-18T14:45:00')
    },
    {
      total: 104.97,
      status: 'ready',
      payment_method: 'credit_card',
      customer_name: 'Pierre Lefebvre',
      customer_email: 'pierre.lefebvre@example.com',
      created_at: new Date('2023-09-20T09:15:00')
    },
    {
      total: 12.99,
      status: 'paid',
      payment_method: 'paypal',
      customer_name: 'Sophie Bertrand',
      customer_email: 'sophie.bertrand@example.com',
      created_at: new Date('2023-09-22T16:20:00')
    }
  ];
  
  // Insérer les commandes et récupérer leurs IDs
  const orderRows = await knex('orders').insert(orders).returning('id');
  
  // Extraire les valeurs des IDs à partir des objets retournés
  const orderIds = orderRows.map(row => row.id);
  
  // Créer les articles des commandes
  const orderItems = [
    {
      order_id: orderIds[0],
      product_id: products[0].id,  // Polo avec Logo
      quantity: 2,
      selected_size: 'M'
    },
    {
      order_id: orderIds[0],
      product_id: products[2].id,  // Pantalon Chino
      quantity: 1,
      selected_size: 'L'
    },
    {
      order_id: orderIds[1],
      product_id: products[1].id,  // Jupe Plissée
      quantity: 1,
      selected_size: 'M'
    },
    {
      order_id: orderIds[2],
      product_id: products[4].id,  // Blazer Scolaire
      quantity: 1,
      selected_size: 'L'
    },
    {
      order_id: orderIds[2],
      product_id: products[3].id,  // Cardigan Scolaire
      quantity: 1,
      selected_size: 'M'
    },
    {
      order_id: orderIds[2],
      product_id: products[0].id,  // Polo avec Logo
      quantity: 1,
      selected_size: 'S'
    },
    {
      order_id: orderIds[3],
      product_id: products[5].id,  // T-shirt d'EPS
      quantity: 1,
      selected_size: 'M'
    }
  ];
  
  // Insérer les articles des commandes
  await knex('order_items').insert(orderItems);
};
