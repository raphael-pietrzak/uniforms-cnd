export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  condition: 'new' | 'used';
  brand: string;
  gender: 'boys' | 'girls' | 'unisex';
  images: string[];
  inStock: boolean;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'ready' | 'collected' | string
  payment_method: 'online' | 'inperson';
  customer_name: string;
  customer_email: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}