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

export interface CacheOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

function resolveCache(options?: CacheOptions): RequestInit {
  if (!options) {
    return { cache: "no-store" };
  }

  const next: { revalidate?: number | false; tags?: string[] } = {};
  if (options.revalidate !== undefined) next.revalidate = options.revalidate;
  if (options.tags) next.tags = options.tags;

  const init: RequestInit = {};
  if (options.cache && options.revalidate === undefined) {
    init.cache = options.cache;
  }
  if (Object.keys(next).length > 0) {
    (init as RequestInit & { next?: typeof next }).next = next;
  }
  return init;
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  cacheOptions?: CacheOptions,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers ?? {}),
      },
      // Caching hints are applied last so they win over any `init` defaults.
      ...resolveCache(cacheOptions),
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

export async function getProducts(
  cacheOptions?: CacheOptions,
): Promise<Product[]> {
  const data = await apiFetch<{ products: RawProduct[] }>(
    "/products",
    undefined,
    cacheOptions,
  );
  return data.products.map(mapProduct);
}

export async function getProduct(
  id: string,
  cacheOptions?: CacheOptions,
): Promise<Product | null> {
  try {
    const data = await apiFetch<{ product: RawProduct }>(
      `/products/${id}`,
      undefined,
      cacheOptions,
    );
    return mapProduct(data.product);
  } catch {
    return null;
  }
}

export async function getCategories(
  cacheOptions?: CacheOptions,
): Promise<Category[]> {
  const data = await apiFetch<{ categories: RawCategory[] }>(
    "/categories",
    undefined,
    cacheOptions,
  );
  return data.categories.map(mapCategory);
}

export async function getCategory(
  id: string,
  cacheOptions?: CacheOptions,
): Promise<Category | null> {
  try {
    const data = await apiFetch<{ category: RawCategory }>(
      `/categories/${id}`,
      undefined,
      cacheOptions,
    );
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

/**
 * Perform an authenticated write request (POST/PUT/DELETE).
 *
 * Unlike {@link apiFetch}, this parses the backend error body and re-throws
 * the server-provided `message` so UI can surface specific errors such as the
 * 409 "has active orders" response when deleting a product/category.
 */
async function writeFetch<T>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body: unknown,
  token: string,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...authHeader(token),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
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
    let backendMessage: string | null = null;
    try {
      const parsed = (await res.json()) as { message?: string } | null;
      backendMessage = parsed?.message ?? null;
    } catch {
      backendMessage = null;
    }
    throw new ApiError(
      backendMessage ?? `Request failed with status ${res.status}.`,
      res.status,
      technicalMessage,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

function toProductPayload(input: ProductInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: input.name,
    price: input.price,
    stock: input.stock,
  };
  if (input.description !== undefined) {
    payload.description = input.description;
  }
  if (input.category !== undefined) {
    payload.category_name = input.category;
  }
  return payload;
}

function toCategoryPayload(input: CategoryInput): Record<string, unknown> {
  const payload: Record<string, unknown> = { name: input.name };
  if (input.description !== undefined) {
    payload.description = input.description;
  }
  return payload;
}

export async function createProduct(
  input: ProductInput,
  token: string,
): Promise<Product> {
  const data = await writeFetch<{ product: RawProduct }>(
    "/products",
    "POST",
    toProductPayload(input),
    token,
  );
  return mapProduct(data.product);
}

export async function updateProduct(
  id: number | string,
  input: ProductInput,
  token: string,
): Promise<Product> {
  const data = await writeFetch<{ product: RawProduct }>(
    `/products/${id}`,
    "PUT",
    toProductPayload(input),
    token,
  );
  return mapProduct(data.product);
}

export async function deleteProduct(
  id: number | string,
  token: string,
): Promise<void> {
  await writeFetch<void>(`/products/${id}`, "DELETE", undefined, token);
}

export async function createCategory(
  input: CategoryInput,
  token: string,
): Promise<Category> {
  const data = await writeFetch<{ category: RawCategory }>(
    "/categories",
    "POST",
    toCategoryPayload(input),
    token,
  );
  return mapCategory(data.category);
}

export async function updateCategory(
  id: number | string,
  input: CategoryInput,
  token: string,
): Promise<Category> {
  const data = await writeFetch<{ category: RawCategory }>(
    `/categories/${id}`,
    "PUT",
    toCategoryPayload(input),
    token,
  );
  return mapCategory(data.category);
}

export async function deleteCategory(
  id: number | string,
  token: string,
): Promise<void> {
  await writeFetch<void>(`/categories/${id}`, "DELETE", undefined, token);
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
