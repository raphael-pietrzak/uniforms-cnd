import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';

// API base URL
const API_URL = 'http://localhost:3000/api';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (paymentMethod: 'online' | 'inperson', customerInfo: { name: string; email: string }) => Promise<void>;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  toggleProductStatus: (productId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les produits au montage du composant
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fonctions d'API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }
      const data = await response.json();
      // Transformer les chaînes JSON en objets JS
      const formattedProducts = data.map((product: any) => ({
        ...product,
        sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
        id: product.id.toString() // Assure que l'ID est une chaîne
      }));
      setProducts(formattedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de manipulation du panier (inchangées)
  const addToCart = (product: Product, selectedSize: string) => {
    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItem) {
      updateQuantity(product.id, selectedSize, existingItem.quantity + 1);
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize }]);
    }
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(cart.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Mise à jour de checkout pour utiliser l'API
  const checkout = async (
    paymentMethod: 'online' | 'inperson',
    customerInfo: { name: string; email: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        items: cart,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        paymentMethod,
        total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        status: paymentMethod === 'online' ? 'paid' : 'pending',
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const newOrder = await response.json();
      setOrders([newOrder, ...orders]);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour des fonctions de gestion des produits
  const addProduct = async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          sizes: JSON.stringify(product.sizes),
          images: JSON.stringify(product.images)
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du produit');
      }

      const newProduct = await response.json();
      // Formater le produit pour le frontend
      const formattedProduct = {
        ...newProduct,
        sizes: typeof newProduct.sizes === 'string' ? JSON.parse(newProduct.sizes) : newProduct.sizes,
        images: typeof newProduct.images === 'string' ? JSON.parse(newProduct.images) : newProduct.images,
        id: newProduct.id.toString()
      };
      
      setProducts([...products, formattedProduct]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedProduct,
          sizes: JSON.stringify(updatedProduct.sizes),
          images: JSON.stringify(updatedProduct.images)
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du produit');
      }

      const product = await response.json();
      // Formater le produit pour le frontend
      const formattedProduct = {
        ...product,
        sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
        images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
        id: product.id.toString()
      };

      setProducts(
        products.map((p) => (p.id === formattedProduct.id ? formattedProduct : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      // D'abord, trouver le produit actuel
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Produit non trouvé');
      }

      // Mettre à jour le statut
      const updatedProduct = {
        ...product,
        inStock: !product.inStock
      };

      // Appeler l'API pour mettre à jour
      await updateProduct(updatedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        isAdmin,
        setIsAdmin,
        addProduct,
        updateProduct,
        toggleProductStatus,
        loading,
        error
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};