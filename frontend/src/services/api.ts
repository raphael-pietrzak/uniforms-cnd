import { Product, Order } from '../types';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/';
const API_URL = `${BASE_URL}api`;

// Fonction utilitaire pour récupérer le token d'accès
const getAccessToken = (): string | null => {
  const tokensStr = localStorage.getItem('tokens');
  if (!tokensStr) return null;
  
  try {
    const tokens = JSON.parse(tokensStr);
    return tokens.accessToken || null;
  } catch (e) {
    console.error('Erreur lors de la récupération du token:', e);
    return null;
  }
};

// Fonction pour obtenir les en-têtes d'authentification
const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  return response.json();
};

// Fonction pour construire l'URL complète des images
export const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return 'https://placehold.co/600x400?text=Image+placeholder';
  
  // Si l'image est déjà une URL complète (http:// ou https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si c'est un chemin relatif vers uploads
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // Fallback au placeholder
  return 'https://placehold.co/600x400?text=Image+placeholder';
};

// Formatter les produits pour la consommation par le frontend
const formatProduct = (product: any): Product => {
  let parsedImages: string[];
  try {
    // Tenter de parser les images JSON
    parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch (e) {
    console.error('Erreur de parsing des images:', e);
    parsedImages = ['https://placehold.co/600x400?text=Image+placeholder'];
  }

  return {
    ...product,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
    images: parsedImages.map(getFullImageUrl),
    id: product.id.toString()
  };
};

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
      headers: {
        ...getAuthHeaders()
      },
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
      headers: {
        ...getAuthHeaders()
      },
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
      headers: getAuthHeaders()
    });
    await handleResponse(response);
  },
};

// Service d'upload des images
export const uploadApi = {
  uploadImages: async (imageFiles: File[]): Promise<string[]> => {
    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const token = getAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const result = await handleResponse(response);
    return result.files;
  }
};

// Commandes API
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data;
  },

  create: async (orderData: any): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    const data = await handleResponse(response);
    return data;
  },

  updateStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await handleResponse(response);
    return data;
  },
};

// Stripe API
export const stripeApi = {
  createCheckoutSession: async (items: any[], customerEmail: string) => {
    const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, customerEmail }),
    });
    const data = await handleResponse(response);
    return data;
  },
  
  getCheckoutSession: async (sessionId: string) => {
    const response = await fetch(`${API_URL}/stripe/checkout-session/${sessionId}`);
    const data = await handleResponse(response);
    return data;
  }
};

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return handleResponse(response);
  },

  logout: async (refreshToken: string) => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    return handleResponse(response);
  },
};
