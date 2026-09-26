import type {
  CartItem,
  CartTotals,
  CatalogState,
  CategoryFilter,
  Product,
  SortMode,
} from "./types.js";
import { PRODUCTS, TAX_RATE, formatIDR } from "./products.js";

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Missing required element #${id}`);
  }
  return el as T;
}

const grid = byId<HTMLDivElement>("product-grid");
const searchInput = byId<HTMLInputElement>("search");
const sortSelect = byId<HTMLSelectElement>("sort");
const categoryFilters = byId<HTMLDivElement>("category-filters");
const cartList = byId<HTMLUListElement>("cart-items");
const cartTotalsEl = byId<HTMLDivElement>("cart-totals");
const cartPill = byId<HTMLSpanElement>("cart-pill");
const clearCartBtn = byId<HTMLButtonElement>("clear-cart");

const state: CatalogState = {
  searchTerm: "",
  activeCategory: "all",
  sortMode: "default",
  cart: [],
};

function getVisibleProducts(): Product[] {
  const term = state.searchTerm.trim().toLowerCase();

  let list = PRODUCTS.filter((p) => {
    const matchesCategory =
      state.activeCategory === "all" || p.category === state.activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  switch (state.sortMode) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case "default":
    default:
      break;
  }

  return list;
}

function cartItemCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotals(cart: CartItem[]): CartTotals {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 25000;
  const grand = Math.round(subtotal + tax + shipping);
  return { subtotal, tax, shipping, grand };
}

function getCategories(): CategoryFilter[] {
  return PRODUCTS.reduce<CategoryFilter[]>(
    (acc, p) => (acc.includes(p.category) ? acc : [...acc, p.category]),
    ["all"]
  );
}


function createProductCard(product: Product): HTMLDivElement {
  const card = document.createElement("div");
  card.className =
    "group flex flex-col gap-2 rounded-xl border border-white/10 bg-carbon-700/70 p-3.5 transition hover:-translate-y-0.5 hover:border-mblue/60 hover:shadow-glow";
  if (!product.inStock) card.classList.add("opacity-60");

  
  const media = document.createElement("div");
  media.className = "flex flex-col gap-2";

  const img = document.createElement("img");
  img.alt = product.name;
  img.className =
    "block aspect-square w-full rounded-lg bg-carbon-600 object-cover ring-1 ring-white/10 transition group-hover:ring-mblue/50";
  if (product.image) {
    img.src = product.image;
  } else {
    img.classList.add("border", "border-dashed", "border-white/20");
    img.alt = "No image uploaded";
  }

  const uploadLabel = document.createElement("label");
  uploadLabel.className =
    "inline-block cursor-pointer rounded-lg border border-white/10 bg-carbon-600 px-3 py-2 text-center text-xs font-semibold text-gray-200 transition hover:border-mblue/60 hover:text-white";
  uploadLabel.textContent = product.image ? "Change image" : "Upload image";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className = "hidden";
  fileInput.dataset.id = String(product.id);
  fileInput.dataset.role = "upload";
  uploadLabel.appendChild(fileInput);

  media.append(img, uploadLabel);

  const cat = document.createElement("div");
  cat.className = "text-xs font-semibold uppercase tracking-[0.2em] text-mblue";
  cat.textContent = product.category;

  const name = document.createElement("div");
  name.className = "font-semibold text-white";
  name.textContent = product.name;

  const rating = document.createElement("div");
  rating.className = "text-sm text-amber-400";
  rating.textContent =
    "★".repeat(Math.round(product.rating)) + ` ${product.rating.toFixed(1)}`;

  const price = document.createElement("div");
  price.className = "text-lg font-bold text-white";
  price.textContent = formatIDR(product.price);

  card.append(media, cat, name, rating, price);

  if (!product.inStock) {
    const badge = document.createElement("span");
    badge.className =
      "self-start rounded-full bg-mred/15 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-mred ring-1 ring-mred/40";
    badge.textContent = "OUT OF STOCK";
    card.append(badge);
  }

  const btn = document.createElement("button");
  if (product.inStock) {
    btn.textContent = "Add to cart";
    btn.dataset.id = String(product.id);
    btn.dataset.role = "add";
    btn.className =
      "mt-auto w-full rounded-lg bg-mblue px-3.5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark hover:shadow-glow active:translate-y-px";
  } else {
    btn.textContent = "Sold out";
    btn.disabled = true;
    btn.className =
      "mt-auto w-full cursor-not-allowed rounded-lg border border-white/10 bg-carbon-600 px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wide text-gray-500";
  }
  card.append(btn);

  return card;
}

function renderGrid(): void {
  const products = getVisibleProducts();
  grid.innerHTML = "";

  if (products.length === 0) {
    const empty = document.createElement("p");
    empty.className = "italic text-gray-400";
    empty.textContent = "No products match your search.";
    grid.append(empty);
    return;
  }

  products.forEach((product) => grid.appendChild(createProductCard(product)));
}

function renderCategoryChips(): void {
  categoryFilters.innerHTML = "";

  getCategories().forEach((cat) => {
    const chip = document.createElement("button");
    const active = cat === state.activeCategory;
    chip.className =
      "rounded-full px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide transition " +
      (active
        ? "bg-mblue text-white shadow-glow"
        : "border border-white/10 bg-carbon-700 text-gray-300 hover:border-mblue/50 hover:text-white");
    chip.textContent = cat === "all" ? "All" : cat;
    chip.dataset.category = cat;
    chip.dataset.role = "chip";
    categoryFilters.appendChild(chip);
  });
}

function renderCart(): void {
  cartList.innerHTML = "";

  if (state.cart.length === 0) {
    const li = document.createElement("li");
    li.className = "italic text-gray-400";
    li.textContent = "Your cart is empty.";
    cartList.appendChild(li);
  } else {
    state.cart.forEach((item) => {
      const li = document.createElement("li");
      li.className =
        "flex items-center justify-between gap-2.5 rounded-lg border border-white/10 bg-carbon-700/60 px-3 py-2.5 text-gray-100";

      const label = document.createElement("span");
      label.className = "flex items-center gap-2";
      if (item.product.image) {
        const thumb = document.createElement("img");
        thumb.className = "h-8 w-8 rounded-md object-cover";
        thumb.src = item.product.image;
        thumb.alt = item.product.name;
        label.appendChild(thumb);
      }
      const labelText = document.createElement("span");
      labelText.textContent = item.product.name;
      label.appendChild(labelText);

      const qty = document.createElement("div");
      qty.className = "flex items-center gap-2";

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.dataset.action = "dec";
      minus.dataset.id = String(item.product.id);
      minus.className =
        "rounded-md border border-white/10 bg-carbon-600 px-2.5 py-0.5 font-semibold text-gray-100 transition hover:border-mblue/50 hover:text-white";

      const count = document.createElement("span");
      count.textContent = String(item.qty);

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.dataset.action = "inc";
      plus.dataset.id = String(item.product.id);
      plus.className =
        "rounded-md border border-white/10 bg-carbon-600 px-2.5 py-0.5 font-semibold text-gray-100 transition hover:border-mblue/50 hover:text-white";

      const lineTotal = document.createElement("span");
      lineTotal.className = "font-semibold";
      lineTotal.textContent = formatIDR(item.product.price * item.qty);

      qty.append(minus, count, plus);
      li.append(label, qty, lineTotal);
      cartList.appendChild(li);
    });
  }

  const { subtotal, tax, shipping, grand } = cartTotals(state.cart);
  cartTotalsEl.innerHTML = "";

  const rows: ReadonlyArray<readonly [string, number]> = [
    ["Subtotal", subtotal],
    ["Tax (8%)", tax],
    ["Shipping", shipping],
  ];
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "flex justify-between";
    row.innerHTML = `<span>${label}</span><span>${formatIDR(value)}</span>`;
    cartTotalsEl.appendChild(row);
  });

  const grandRow = document.createElement("div");
  grandRow.className = "flex justify-between text-base font-bold";
  grandRow.innerHTML = `<span>Total</span><span>${formatIDR(grand)}</span>`;
  cartTotalsEl.appendChild(grandRow);

  cartPill.textContent = `Cart: ${cartItemCount(state.cart)} items · ${formatIDR(
    grand
  )}`;
}

function renderAll(): void {
  renderCategoryChips();
  renderGrid();
  renderCart();
}

function addToCart(productId: number): void {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || !product.inStock) return;

  const existing = state.cart.find((item) => item.product.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ product, qty: 1 });
  }
  renderCart();
}

function changeQty(productId: number, delta: number): void {
  const item = state.cart.find((i) => i.product.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((i) => i.product.id !== productId);
  }
  renderCart();
}

function isSortMode(value: string): value is SortMode {
  return (
    value === "default" ||
    value === "price-asc" ||
    value === "price-desc" ||
    value === "rating"
  );
}

searchInput.addEventListener("input", (e) => {
  const target = e.target as HTMLInputElement;
  state.searchTerm = target.value;
  renderGrid();
});

sortSelect.addEventListener("change", (e) => {
  const value = (e.target as HTMLSelectElement).value;
  if (isSortMode(value)) {
    state.sortMode = value;
    renderGrid();
  }
});

categoryFilters.addEventListener("click", (e) => {
  const chip = (e.target as HTMLElement).closest<HTMLButtonElement>(
    "button[data-role='chip']"
  );
  if (!chip || !chip.dataset.category) return;
  state.activeCategory = chip.dataset.category as CategoryFilter;
  renderCategoryChips();
  renderGrid();
});

grid.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
    "button[data-role='add']"
  );
  if (!btn || !btn.dataset.id) return;
  addToCart(Number(btn.dataset.id));
});

grid.addEventListener("change", (e) => {
  const input = (e.target as HTMLElement).closest<HTMLInputElement>(
    "input[data-role='upload']"
  );
  if (!input || !input.files || !input.files[0] || !input.dataset.id) return;

  const productId = Number(input.dataset.id);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    product.image = reader.result as string;
    renderGrid();
    renderCart();
  };
  reader.readAsDataURL(file);
});

cartList.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
    "button[data-action]"
  );
  if (!btn || !btn.dataset.id) return;
  const id = Number(btn.dataset.id);
  changeQty(id, btn.dataset.action === "inc" ? 1 : -1);
});

clearCartBtn.addEventListener("click", () => {
  state.cart = [];
  renderCart();
});

renderAll();
