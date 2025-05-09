import { Product, Order } from '../types';

const API_URL = 'http://localhost:3000/api';

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  return response.json();
};

// Formatter les produits pour la consommation par le frontend
const formatProduct = (product: any): Product => ({
  ...product,
  sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
  images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
  id: product.id.toString()
});

// Produits API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`);
    const data = await handleResponse(response);
    return data.map(formatProduct);
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await handleResponse(response);
    return formatProduct(data);
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        sizes: JSON.stringify(product.sizes),
        images: JSON.stringify(product.images)
      }),
    });
    const data = await handleResponse(response);
    return formatProduct(data);
  },

  update: async (product: Product): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        sizes: JSON.stringify(product.sizes),
        images: JSON.stringify(product.images)
      }),
    });
    const data = await handleResponse(response);
    return formatProduct(data);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },
};

// Commandes API
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/orders`);
    const data = await handleResponse(response);
    return data;
  },

  create: async (orderData: any): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await handleResponse(response);
    return data;
  },

  updateStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await handleResponse(response);
    return data;
  },
};

// Stripe API
export const stripeApi = {
  createCheckoutSession: async (items: any[], customerEmail: string) => {
    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, customerEmail }),
    });
    const data = await handleResponse(response);
    return data;
  },
  
  getCheckoutSession: async (sessionId: string) => {
    const response = await fetch(`${API_URL}/checkout-session/${sessionId}`);
    const data = await handleResponse(response);
    return data;
  }
};

// Auth API (pour plus tard)
export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    return data;
  },
};
