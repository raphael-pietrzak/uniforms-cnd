export interface InventoryItem {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  condition: 'new' | 'used';
  brand: string;
  gender: 'boys' | 'girls' | 'unisex';
  images: string[];
  category: string;
  inventory: InventoryItem[];
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

// Types pour SumUp
export interface SumUpCard {
  name: string;
  number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
}

export interface SumUpPaymentRequest {
  payment_type: 'card';
  card: SumUpCard;
}

export interface SumUpCheckout {
  id: string;
  url: string;
}


export interface SumUpPaymentResponse {
  id: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  amount: number;
  currency: string;
  description: string;
  checkout_reference: string;
  merchant_code: string;
  date: string;
  transaction_code?: string;
  transaction_id?: string;
  transactions?: {
    id: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';
    payment_type: string;
    entry_mode: string;
    installments_count: number;
    internal_id: number;
    merchant_code: string;
    timestamp: string;
    transaction_code: string;
  }[];
}