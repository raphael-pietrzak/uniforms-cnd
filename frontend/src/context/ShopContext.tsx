import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, InventoryItem } from '../types';
import { productsApi, ordersApi, stripeApi } from '../services/api';

// Clé pour le localStorage
const CART_STORAGE_KEY = 'cnd-uniformes-cart';

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
  updateInventory: (productId: string, size: string, quantity: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  lastOrder?: Order;
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
    
    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Erreur lors du chargement du panier:', err);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    
    // Charger les commandes si l'utilisateur est admin
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);
  
  // Mettre à jour localStorage quand le panier change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

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
    // Vérifier la disponibilité du stock
    const inventoryItem = product.inventory?.find(item => item.size === selectedSize);
    if (!inventoryItem || inventoryItem.quantity <= 0) {
      setError('Ce produit n\'est plus disponible dans cette taille.');
      return;
    }
    
    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.selectedSize === selectedSize
    );

    // Si le produit est déjà dans le panier, vérifier si on peut augmenter la quantité
    if (existingItem) {
      // Vérifier si on a assez de stock pour augmenter la quantité
      if (existingItem.quantity + 1 > inventoryItem.quantity) {
        setError(`Il ne reste que ${inventoryItem.quantity} exemplaire(s) de ce produit en taille ${selectedSize}.`);
        return;
      }
      updateQuantity(product.id, selectedSize, existingItem.quantity + 1);
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize }]);
    }
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(cart.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    const cartItem = cart.find(item => item.product.id === productId && item.selectedSize === size);
    if (!cartItem) return;
    
    // Vérifier la disponibilité du stock
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const inventoryItem = product.inventory?.find(item => item.size === size);
    if (!inventoryItem) return;
    
    // Ne pas autoriser une quantité supérieure au stock disponible
    const newQuantity = Math.min(Math.max(1, quantity), inventoryItem.quantity);
    
    setCart(
      cart.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Mise à jour de checkout pour utiliser Stripe et gérer le stock
  const checkout = async (
    paymentMethod: 'online' | 'inperson',
    customerInfo: { name: string; email: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Vérifier le stock avant de procéder
      for (const item of cart) {
        const product = products.find(p => p.id === item.product.id);
        if (!product) continue;
        
        const inventoryItem = product.inventory?.find(inv => inv.size === item.selectedSize);
        if (!inventoryItem || inventoryItem.quantity < item.quantity) {
          throw new Error(`Le produit "${product.name}" en taille ${item.selectedSize} n'est plus disponible en quantité suffisante.`);
        }
      }
      
      if (paymentMethod === 'online') {
        // Utiliser Stripe pour le paiement en ligne
        const session = await stripeApi.createCheckoutSession(cart, customerInfo.email);
        
        // Note: Le stock sera mis à jour lors de la confirmation du paiement par le webhook Stripe
        
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
        
        // La mise à jour du stock est maintenant gérée par le backend
        // Il n'est plus nécessaire d'appeler updateInventory ici
        
        setOrders([newOrder, ...orders]);
        clearCart();
        
        // Retourner une redirection vers la page de succès
        return { redirect: `/checkout/success?orderId=${newOrder.id}` };
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

  const updateInventory = async (productId: string, size: string, quantityChange: number) => {
    setLoading(true);
    setError(null);
    try {
      // Trouver le produit actuel
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Produit non trouvé');
      }

      // Trouver l'entrée d'inventaire correspondante
      const inventoryItem = product.inventory?.find(item => item.size === size);
      if (!inventoryItem) {
        throw new Error(`Taille ${size} non trouvée dans l'inventaire du produit`);
      }

      // Calculer la nouvelle quantité
      const newQuantity = Math.max(0, inventoryItem.quantity + quantityChange);
      
      // Appeler l'API pour mettre à jour l'inventaire
      await productsApi.updateInventory(productId, size, newQuantity);
      
      // Mettre à jour le state local
      setProducts(products.map(p => {
        if (p.id !== productId) return p;
        
        const updatedInventory = (p.inventory || []).map(item => 
          item.size === size ? { ...item, quantity: newQuantity } : item
        );
        
        return {
          ...p,
          inventory: updatedInventory,
          inStock: updatedInventory.some(item => item.quantity > 0)
        };
      }));
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
        updateInventory,
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