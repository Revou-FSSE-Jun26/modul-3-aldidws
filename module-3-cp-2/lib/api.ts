import type { Category, Order, Product } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://revo-otoshop.onrender.com";

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
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
