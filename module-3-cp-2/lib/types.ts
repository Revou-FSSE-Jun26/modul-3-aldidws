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
  customerName: string;
  total: number;
  status: string;
  createdAt?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  productId: number | string;
  productName: string;
  quantity: number;
  price: number;
}
