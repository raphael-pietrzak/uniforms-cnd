import { Product, Order } from '../types';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
console.log(import.meta.env.VITE_BACKEND_URL)
const API_URL = `${BASE_URL}/api`;

// Variable globale pour stocker l'access token
let currentAccessToken: string | null = null;

// Fonction pour définir l'access token
export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

// Fonction pour obtenir l'access token actuel
export const getAccessToken = (): string | null => {
  return currentAccessToken;
};

// Fonction pour obtenir les en-têtes par défaut
const getDefaultHeaders = (): Record<string, string> => {
  return { 'Content-Type': 'application/json' };
};

// Fonction pour obtenir les en-têtes avec authentification
const getAuthHeaders = (): Record<string, string> => {
  const headers = getDefaultHeaders();
  if (currentAccessToken) {
    headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }
  return headers;
};

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Pour les erreurs 401 avec code spécifique, on peut déclencher un événement personnalisé
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        if (errorData.code === 'TOKEN_EXPIRED') {
          // Déclencher un événement que le contexte d'authentification peut écouter
          window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
        }
      } catch (e) {
        // Si on ne peut pas parser la réponse, on continue avec le traitement d'erreur normal
      }
    }
    
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || errorData.message || response.statusText;
    } catch (e) {
      errorMessage = errorText || response.statusText;
    }
    throw new Error(errorMessage);
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

  // Préparer l'inventaire
  let inventory = [];
  if (product.inventory) {
    // Si l'inventaire est déjà présent, l'utiliser directement
    inventory = product.inventory;
  } else if (product.sizes) {
    // Sinon, créer un inventaire à partir des tailles (pour compatibilité avec l'ancien format)
    try {
      const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
      inventory = sizes.map((size: string) => ({ size, quantity: 0 }));
    } catch (e) {
      console.error('Erreur de parsing des tailles:', e);
      inventory = [];
    }
  }

  return {
    ...product,
    images: parsedImages.map(getFullImageUrl),
    inventory: inventory,
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
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        ...product,
        images: JSON.stringify(product.images)
      }),
    });
    const data = await handleResponse(response);
    return formatProduct(data);
  },

  update: async (product: Product): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        ...product,
        images: JSON.stringify(product.images)
      }),
    });
    const data = await handleResponse(response);
    return formatProduct(data);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    await handleResponse(response);
  },
  
  // Nouvelle méthode pour mettre à jour l'inventaire
  updateInventory: async (productId: string, size: string, quantity: number): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${productId}/inventory/${size}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ quantity }),
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

    const authHeaders = getAuthHeaders();
    // Supprimer Content-Type pour FormData, mais garder Authorization
    const headers: Record<string, string> = {};
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: headers,
      credentials: 'include',
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
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await handleResponse(response);
    return data;
  },
  
  getById: async (orderId: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await handleResponse(response);
    return data;
  },

  create: async (orderData: any): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(orderData),
    });
    const data = await handleResponse(response);
    return data;
  },

  updateStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    const data = await handleResponse(response);
    return data;
  },
  
  delete: async (orderId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    await handleResponse(response);
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
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  refreshToken: async () => {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  // Nouvelles méthodes pour la récupération de mot de passe
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },
  
  resetPassword: async (token: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    return handleResponse(response);
  },
};
