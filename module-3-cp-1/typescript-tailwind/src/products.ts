import type { Product } from "./types.js";

const imageFor = (id: number): string =>
  `../image/Product-id-${id}.${id === 10 ? "jpg" : "jpeg"}`;

const PRODUCT_DATA: readonly Omit<Product, "image">[] = [
  { id: 1, name: "Velg BBS RS R16", category: "wheels", price: 24000000, rating: 4.5, inStock: true },
  { id: 2, name: "Velg BMW BBS Bugatti R17", category: "wheels", price: 9500000, rating: 4.8, inStock: true },
  { id: 3, name: "Bemper Depan M-Tech BMW E36 FRP", category: "accessories", price: 1850000, rating: 4.2, inStock: false },
  { id: 4, name: "Spion M3 BMW E36 FRP", category: "accessories", price: 1200000, rating: 4.7, inStock: true },
  { id: 5, name: "Oli Mobil BMW TwinPower Turbo Engine Oil LL-04 SAE 5W-30", category: "engine", price: 430000, rating: 4.0, inStock: true },
  { id: 6, name: "Oil Filter BMW Engine B48", category: "engine", price: 550000, rating: 4.3, inStock: false },
  { id: 7, name: "Jok Racing SPARCO Torino Hitam", category: "interior", price: 3150000, rating: 4.6, inStock: true },
  { id: 8, name: "Karpet Dasar Mobil", category: "interior", price: 350000, rating: 4.1, inStock: true },
  { id: 9, name: "Shell Radiator Coolant LongLife Plus 4L", category: "engine", price: 60000, rating: 4.4, inStock: true },
  { id: 10, name: "BBS Tutup Dop Velg", category: "wheels", price: 110000, rating: 3.9, inStock: true },
  { id: 11, name: "Spoiler GT Wing Performance BMW G30 G20 G80 M3 M4 G82", category: "accessories", price: 3200000, rating: 4.5, inStock: true },
  { id: 12, name: "Kipas Radiator Fan Belt BMW E36 E34 E39 E46 M50 M52 M54", category: "engine", price: 295000, rating: 4.4, inStock: true },
  { id: 13, name: "Velg BBS RS R16", category: "wheels", price: 24000000, rating: 4.5, inStock: true },
  { id: 14, name: "G80 M3 Smoked OLED Tail Light with LED Sequential Indicator", category: "accessories", price: 6960000, rating: 4.5, inStock: true },
  { id: 15, name: "Shell Helix HX6 10W-40 4L ", category: "engine", price: 270000, rating: 4.8, inStock: true },
  { id: 16, name: "Velg BMW seri 3 E46) ", category: "wheels", price: 16500000, rating: 4.8, inStock: true },
];

export const PRODUCTS: Product[] = PRODUCT_DATA.map((p) => ({
  ...p,
  image: imageFor(p.id),
}));

export const TAX_RATE = 0.08;

export function formatIDR(amount: number): string {
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}
