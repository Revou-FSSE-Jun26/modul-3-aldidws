
export type Category = "wheels" | "accessories" | "engine" | "interior";

export type Rupiah = number;


export type Rating = number;

export interface Product {
  readonly id: number;
  name: string;
  category: Category;
  price: Rupiah;
  rating: Rating;
  inStock: boolean;
  image?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type SortMode = "default" | "price-asc" | "price-desc" | "rating";

export type CategoryFilter = Category | "all";

export interface CatalogState {
  searchTerm: string;
  activeCategory: CategoryFilter;
  sortMode: SortMode;
  cart: CartItem[];
}

export type CartTotals = {
  subtotal: Rupiah;
  tax: Rupiah;
  shipping: Rupiah;
  grand: Rupiah;
};
