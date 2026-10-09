import type { Category, Order, Product } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://module-2-aldidws-1.onrender.com";

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch {
    throw new Error(
      `Unable to connect to the API at ${url}. Ensure the Flask server is running.`,
    );
  }

  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}.`);
  }

  return (await res.json()) as T;
}

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${id}`);
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export async function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders");
}
