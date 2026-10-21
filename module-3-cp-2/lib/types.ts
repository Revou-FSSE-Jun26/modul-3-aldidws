export interface Product {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
}

export interface Category {
  id: number | string;
  name: string;
  description?: string;
  productCount?: number;
}

export interface Order {
  id: number | string;
  orderNumber?: string;
  customerName: string;
  total: number;
  status: string;
  createdAt?: string;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  customerNote?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  productId: number | string;
  productName: string;
  quantity: number;
  price: number;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  redirect?: string;
}
