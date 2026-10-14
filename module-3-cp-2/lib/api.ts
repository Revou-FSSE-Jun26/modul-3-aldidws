import type { Order, OrderItem, Category, Product } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://revo-otoshop.onrender.com";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      `Unable to connect to the API at ${url}. Ensure the catalog server is running.`,
    );
  }

  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}.`);
  }

  return (await res.json()) as T;
}

interface RawProduct {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  stock: number;
  category_name?: string | null;
  image_url?: string | null;
}

interface RawCategory {
  id: string;
  name: string;
  description?: string | null;
}

function mapProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    price: Number(raw.price),
    stock: raw.stock,
    category: raw.category_name ?? undefined,
    imageUrl: raw.image_url ?? undefined,
  };
}

function mapCategory(raw: RawCategory): Category {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<{ products: RawProduct[] }>("/products");
  return data.products.map(mapProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const data = await apiFetch<{ product: RawProduct }>(`/products/${id}`);
    return mapProduct(data.product);
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const data = await apiFetch<{ categories: RawCategory[] }>("/categories");
  return data.categories.map(mapCategory);
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    const data = await apiFetch<{ category: RawCategory }>(`/categories/${id}`);
    return mapCategory(data.category);
  } catch {
    return null;
  }
}

export async function getOrders(): Promise<Order[]> {
  const data = await apiFetch<{ orders: Order[] }>("/orders");
  return data.orders;
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const data = await apiFetch<{ order: Order }>(`/orders/${id}`);
    return data.order;
  } catch {
    return null;
  }
}

interface RawOrderItem {
  product_id: string | number;
  product_name: string;
  quantity: number;
  price: string | number;
}

interface RawOrder {
  id: string | number;
  customer_name: string;
  total: string | number;
  status: string;
  created_at?: string | null;
  items?: RawOrderItem[];
}

function mapOrderItem(raw: RawOrderItem): OrderItem {
  return {
    productId: raw.product_id,
    productName: raw.product_name,
    quantity: raw.quantity,
    price: Number(raw.price),
  };
}

function mapOrder(raw: RawOrder): Order {
  return {
    id: raw.id,
    customerName: raw.customer_name,
    total: Number(raw.total),
    status: raw.status,
    createdAt: raw.created_at ?? undefined,
    items: raw.items?.map(mapOrderItem),
  };
}

export interface CreateOrderItemInput {
  productId: number | string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  email: string;
  address: string;
  items: CreateOrderItemInput[];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const payload = {
    customer_name: input.customerName,
    email: input.email,
    address: input.address,
    items: input.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  };

  const data = await apiFetch<{ order: RawOrder }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapOrder(data.order);
}

// --- Admin -----------------------------------------------------------------

function authHeader(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Admin view of all orders. Requires an admin bearer token; the API is
 * expected to enforce the authorization server-side.
 */
export async function getAdminOrders(token: string): Promise<Order[]> {
  const data = await apiFetch<{ orders: RawOrder[] }>("/orders", {
    headers: authHeader(token),
  });
  return data.orders.map(mapOrder);
}

export interface DashboardStats {
  productCount: number;
  categoryCount: number;
  orderCount: number;
  totalRevenue: number;
  lowStockCount: number;
  recentOrders: Order[];
}

/**
 * Aggregates the data an admin dashboard needs in one call. Fetches
 * products, categories and orders in parallel and derives summary metrics.
 */
export async function getDashboardStats(
  token: string,
): Promise<DashboardStats> {
  const [products, categories, orders] = await Promise.all([
    getProducts(),
    getCategories(),
    getAdminOrders(token),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const recentOrders = [...orders]
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  return {
    productCount: products.length,
    categoryCount: categories.length,
    orderCount: orders.length,
    totalRevenue,
    lowStockCount,
    recentOrders,
  };
}
