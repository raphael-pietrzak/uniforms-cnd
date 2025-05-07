import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order } from '../types';
import { sampleProducts } from '../data/sampleProducts';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (paymentMethod: 'online' | 'inperson', customerInfo: { name: string; email: string }) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  toggleProductStatus: (productId: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const checkout = (
    paymentMethod: 'online' | 'inperson',
    customerInfo: { name: string; email: string }
  ) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: paymentMethod === 'online' ? 'paid' : 'pending',
      paymentMethod,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      createdAt: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    clearCart();
  };

  const addProduct = (product: Product) => {
    setProducts([...products, { ...product, id: `product-${Date.now()}` }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, inStock: !product.inStock } : product
      )
    );
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