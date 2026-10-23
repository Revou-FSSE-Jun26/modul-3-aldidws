import * as data from './fixtures.mjs';

export interface RawProduct {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
  category_name: string | null;
  image_url: string | null;
}

export interface RawCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface RawOrderItem {
  product_id: string | number;
  product_name: string;
  quantity: number;
  price: string | number;
}

export interface RawOrder {
  id: string | number;
  order_number: string | null;
  customer_name: string | null;
  total: string | number;
  status: string;
  created_at: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_province: string | null;
  shipping_postal_code: string | null;
  customer_note: string | null;
  items: RawOrderItem[];
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  password: string;
}

export const products: RawProduct[] = data.products;
export const categories: RawCategory[] = data.categories;
export const orders: RawOrder[] = data.orders;
export const users: MockUser[] = data.users;

export function cloneFixtures(): {
  categories: RawCategory[];
  products: RawProduct[];
  users: MockUser[];
  orders: RawOrder[];
} {
  return data.cloneFixtures();
}
