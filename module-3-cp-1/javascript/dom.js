const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const categoryFilters = document.getElementById("category-filters");
const cartList = document.getElementById("cart-items");
const cartTotalsEl = document.getElementById("cart-totals");
const cartPill = document.getElementById("cart-pill");
const clearCartBtn = document.getElementById("clear-cart");

const cart = [];
let activeCategory = "all";
let searchTerm = "";
let sortMode = "default";

function getVisibleProducts() {
  let list = PRODUCTS.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortMode === "price-asc") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sortMode === "price-desc") {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (sortMode === "rating") {
    list = [...list].sort((a, b) => b.rating - a.rating);
  }
  return list;
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product";
  if (!product.inStock) card.classList.add("out");

  const media = document.createElement("div");
  media.className = "media";

  const img = document.createElement("img");
  img.className = "product-img";
  img.alt = product.name;
  if (product.image) {
    img.src = product.image;
  } else {
    img.classList.add("placeholder");
    img.alt = "No image uploaded";
  }

  const uploadLabel = document.createElement("label");
  uploadLabel.className = "upload-btn";
  uploadLabel.textContent = product.image ? "Change image" : "Upload image";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className = "upload-input";
  fileInput.dataset.id = product.id;
  uploadLabel.appendChild(fileInput);

  media.append(img, uploadLabel);

  const cat = document.createElement("div");
  cat.className = "cat";
  cat.textContent = product.category;

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = product.name;

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.textContent = "★".repeat(Math.round(product.rating)) +
    ` ${product.rating.toFixed(1)}`;

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = formatIDR(product.price);

  const btn = document.createElement("button");
  if (product.inStock) {
    btn.textContent = "Add to cart";
    btn.dataset.id = product.id;
    btn.classList.add("add-btn");
  } else {
    btn.textContent = "Sold out";
    btn.classList.add("disabled");
    btn.disabled = true;
  }

  card.append(media, cat, name, rating, price);
  if (!product.inStock) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "OUT OF STOCK";
    card.append(badge);
  }
  card.append(btn);
  return card;
}

function renderGrid() {
  const products = getVisibleProducts();
  grid.innerHTML = "";
  if (products.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No products match your search.";
    grid.append(empty);
    return;
  }

  products.forEach((product) => {
    grid.appendChild(createProductCard(product));
  });
}

function renderCategoryChips() {
  const categories = PRODUCTS.reduce(
    (acc, p) => (acc.includes(p.category) ? acc : [...acc, p.category]),
    ["all"]
  );

  categoryFilters.innerHTML = "";
  categories.forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === activeCategory ? " active" : "");
    chip.textContent = cat === "all" ? "All" : cat;
    chip.dataset.category = cat;
    categoryFilters.appendChild(chip);
  });
}

function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Your cart is empty.";
    cartList.appendChild(li);
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");

      const label = document.createElement("span");
      label.className = "cart-label";
      if (item.product.image) {
        const thumb = document.createElement("img");
        thumb.className = "cart-thumb";
        thumb.src = item.product.image;
        thumb.alt = item.product.name;
        label.appendChild(thumb);
      }
      const labelText = document.createElement("span");
      labelText.textContent = item.product.name;
      label.appendChild(labelText);

      const qty = document.createElement("div");
      qty.className = "qty";

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.dataset.action = "dec";
      minus.dataset.id = item.product.id;

      const count = document.createElement("span");
      count.textContent = item.qty;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.dataset.action = "inc";
      plus.dataset.id = item.product.id;

      const lineTotal = document.createElement("span");
      lineTotal.textContent = formatIDR(item.product.price * item.qty);

      qty.append(minus, count, plus);
      li.append(label, qty, lineTotal);
      cartList.appendChild(li);
    });
  }

  const { subtotal, tax, shipping, grand } = cartTotals(cart);
  cartTotalsEl.innerHTML = "";
  const rows = [
    ["Subtotal", subtotal],
    ["Tax (8%)", tax],
    ["Shipping", shipping],
  ];
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${label}</span><span>${formatIDR(value)}</span>`;
    cartTotalsEl.appendChild(row);
  });
  const grandRow = document.createElement("div");
  grandRow.className = "row grand";
  grandRow.innerHTML = `<span>Total</span><span>${formatIDR(grand)}</span>`;
  cartTotalsEl.appendChild(grandRow);

  cartPill.textContent = `Cart: ${cartItemCount(cart)} items · ${formatIDR(grand)}`;
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || !product.inStock) return;

  const existing = cart.find((item) => item.product.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ product, qty: 1 });
  }
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.product.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }
  renderCart();
}

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderGrid();
});

sortSelect.addEventListener("change", (e) => {
  sortMode = e.target.value;
  renderGrid();
});

categoryFilters.addEventListener("click", (e) => {
  const chip = e.target.closest("button.chip");
  if (!chip) return;
  activeCategory = chip.dataset.category;
  renderCategoryChips(); // refresh active class
  renderGrid();
});

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button.add-btn");
  if (!btn) return;
  addToCart(Number(btn.dataset.id));
});

grid.addEventListener("change", (e) => {
  const input = e.target.closest("input.upload-input");
  if (!input || !input.files || !input.files[0]) return;

  const productId = Number(input.dataset.id);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    product.image = reader.result;
    renderGrid();
    renderCart();
  };
  reader.readAsDataURL(file);
});

cartList.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  changeQty(id, btn.dataset.action === "inc" ? 1 : -1);
});

clearCartBtn.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
});

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryChips();
  renderGrid();
  renderCart();
});
