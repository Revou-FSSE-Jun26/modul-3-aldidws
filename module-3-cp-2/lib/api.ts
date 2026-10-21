import type { Order, OrderItem, Category, Product } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://revo-otoshop.onrender.com";

export class ApiError extends Error {
  status: number;
  technicalMessage: string;

  constructor(message: string, status: number, technicalMessage: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.technicalMessage = technicalMessage;
    this.cause = technicalMessage;
  }
}

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
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
      `Unable to connect to the API at ${url}.`,
    );
  }

  if (!res.ok) {
    const technicalMessage = `Request to ${url} failed with status ${res.status}.`;
    let message: string;
    if (res.status === 404) {
      message = "The requested item could not be found.";
    } else if (res.status >= 500) {
      message = "The server is having trouble right now. Please try again.";
    } else {
      message = "Something went wrong while loading data. Please try again.";
    }
    throw new ApiError(message, res.status, technicalMessage);
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

interface RawOrderItem {
  product_id: string | number;
  product_name: string;
  quantity: number;
  price: string | number;
}

interface RawOrder {
  id: string | number;
  order_number?: string | null;
  customer_name?: string | null;
  total: string | number;
  status: string;
  created_at?: string | null;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_province?: string | null;
  shipping_postal_code?: string | null;
  customer_note?: string | null;
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
    orderNumber: raw.order_number ?? undefined,
    customerName: raw.customer_name ?? raw.recipient_name ?? "",
    total: Number(raw.total),
    status: raw.status,
    createdAt: raw.created_at ?? undefined,
    recipientName: raw.recipient_name ?? undefined,
    recipientPhone: raw.recipient_phone ?? undefined,
    shippingAddress: raw.shipping_address ?? undefined,
    shippingCity: raw.shipping_city ?? undefined,
    shippingProvince: raw.shipping_province ?? undefined,
    shippingPostalCode: raw.shipping_postal_code ?? undefined,
    customerNote: raw.customer_note ?? undefined,
    items: raw.items?.map(mapOrderItem),
  };
}

function authHeader(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export async function getMyOrders(token: string): Promise<Order[]> {
  const data = await apiFetch<{ orders: RawOrder[] }>("/orders", {
    headers: authHeader(token),
  });
  return data.orders.map(mapOrder);
}

export async function getOrder(
  id: string,
  token: string,
): Promise<Order | null> {
  try {
    const data = await apiFetch<{ order: RawOrder }>(`/orders/${id}`, {
      headers: authHeader(token),
    });
    return mapOrder(data.order);
  } catch {
    return null;
  }
}

export interface CreateOrderItemInput {
  productId: number | string;
  quantity: number;
}

export interface CreateOrderInput {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  shippingCost: number;
  discount: number;
  customerNote?: string;
  items: CreateOrderItemInput[];
}

export async function createOrder(
  input: CreateOrderInput,
  token: string,
): Promise<Order> {
  const payload = {
    shipping: {
      recipient_name: input.recipientName,
      recipient_phone: input.recipientPhone,
      shipping_address: input.shippingAddress,
      shipping_city: input.shippingCity,
      shipping_province: input.shippingProvince,
      shipping_postal_code: input.shippingPostalCode,
    },
    shipping_cost: input.shippingCost,
    discount: input.discount,
    customer_note: input.customerNote ?? "",
    items: input.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  };

  const data = await apiFetch<{ order: RawOrder }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeader(token),
  });

  return mapOrder(data.order);
}

// --- Admin -----------------------------------------------------------------

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
