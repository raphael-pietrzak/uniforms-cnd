import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';
import { productsApi, ordersApi, stripeApi } from '../services/api';

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
  checkout: (paymentMethod: 'online' | 'inperson', customerInfo: { name: string; email: string }) => Promise<{ redirect?: string }>;
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

  // Charger les produits et les commandes au montage du composant
  useEffect(() => {
    fetchProducts();
    
    // Charger les commandes si l'utilisateur est admin
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  // Fonctions d'API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
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
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite');
      console.error('Erreur lors du chargement des commandes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de manipulation du panier
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

  // Mise à jour de checkout pour utiliser Stripe
  const checkout = async (
    paymentMethod: 'online' | 'inperson',
    customerInfo: { name: string; email: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (paymentMethod === 'online') {
        // Utiliser Stripe pour le paiement en ligne
        const session = await stripeApi.createCheckoutSession(cart, customerInfo.email);
        
        // Retourner l'URL de redirection Stripe
        return { redirect: session.url };
      } else {
        // Utiliser l'API de commande existante pour le paiement en personne
        const orderData = {
          items: cart,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          paymentMethod,
          total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
          status: 'pending',
        };

        const newOrder = await ordersApi.create(orderData);
        setOrders([newOrder, ...orders]);
        clearCart();
        return {};
      }
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
      const newProduct = await productsApi.create(product);
      setProducts([...products, newProduct]);
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
      const product = await productsApi.update(updatedProduct);
      setProducts(
        products.map((p) => (p.id === product.id ? product : p))
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