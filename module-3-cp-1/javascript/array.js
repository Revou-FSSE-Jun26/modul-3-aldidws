const PRODUCTS = [
  { id: 1, name: "Velg BBS RS R16", image: "../image/Product-id-1.jpeg", category: "wheels", price: 24000000, rating: 4.5, inStock: true },
  { id: 2, name: "Velg BMW BBS Bugatti R17", image: "../image/Product-id-2.jpeg", category: "wheels", price: 9500000, rating: 4.8, inStock: true },
  { id: 3, name: "Bemper Depan M-Tech BMW E36 FRP", image: "../image/Product-id-3.jpeg", category: "accessories", price: 1850000, rating: 4.2, inStock: false },
  { id: 4, name: "Spion M3 BMW E36 FRP", image: "../image/Product-id-4.jpeg", category: "accessories", price: 1200000, rating: 4.7, inStock: true },
  { id: 5, name: "Oli Mobil BMW TwinPower Turbo Engine Oil LL-04 SAE 5W-30", image: "../image/Product-id-5.jpeg", category: "engine", price: 430000, rating: 4.0, inStock: true },
  { id: 6, name: "Oil Filter BMW Engine B48", image: "../image/Product-id-6.jpeg", category: "engine", price: 550000, rating: 4.3, inStock: false },
  { id: 7, name: "Jok Racing SPARCO Torino Hitam", image: "../image/Product-id-7.jpeg", category: "interior", price: 3150000, rating: 4.6, inStock: true },
  { id: 8, name: "Karpet Dasar Mobil", image: "../image/Product-id-8.jpeg", category: "interior", price: 350000, rating: 4.1, inStock: true },
  { id: 9, name: "Shell Radiator Coolant LongLife Plus 4L", image: "../image/Product-id-9.jpeg", category: "engine", price: 60000, rating: 4.4, inStock: true },
  { id: 10, name: "BBS Tutup Dop Velg", image: "../image/Product-id-10.jpg", category: "wheels", price: 110000, rating: 3.9, inStock: true },
  { id: 11, name: "Spoiler GT Wing Performance BMW G30 G20 G80 M3 M4 G82", category: "accessories", price: 3200000, rating: 4.5, inStock: true },
  { id: 12, name: "Kipas Radiator Fan Belt BMW E36 E34 E39 E46 M50 M52 M54", category: "engine", price: 295000, rating: 4.4, inStock: true },
  { id: 13, name: "Velg Original BMW Style 32 R17", category: "wheels", price: 17475000, rating: 4.8, inStock: true },
  { id: 14, name: "G80 M3 Smoked OLED Tail Light with LED Sequential Indicator", category: "accessories", price: 6960000, rating: 4.5, inStock: true },
  { id: 15, name: "Shell Helix HX6 10W-40 4L ", category: "engine", price: 270000, rating: 4.8, inStock: true },
  { id: 16, name: "Velg BMW seri 3 E46 ", category: "wheels", price: 16500000, rating: 4.8, inStock: true },
];

const TAX_RATE = 0.08;

function formatIDR(amount) {
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}

function listAllProducts(products) {
  const lines = [];
  products.forEach((p, index) => {
    const stock = p.inStock ? "in stock" : "SOLD OUT";
    lines.push(`${index + 1}. ${p.name} — ${formatIDR(p.price)} (${stock})`);
  });
  return lines.join("\n");
}

function withTax(products, rate = TAX_RATE) {
  return products.map((p) => ({
    name: p.name,
    price: p.price,
    priceWithTax: Math.round(p.price * (1 + rate)),
  }));
}

function inStockOnly(products) {
  return products.filter((p) => p.inStock);
}

function affordable(products, maxPrice) {
  return products.filter((p) => p.price <= maxPrice);
}

function inStockInventoryValue(products) {
  return products.reduce((sum, p) => (p.inStock ? sum + p.price : sum), 0);
}

function countByCategory(products) {
  return products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
}

function topRated(products) {
  return products.reduce((best, p) => (p.rating > best.rating ? p : best));
}

function avgInStockEnginePrice(products) {
  const prices = products
    .filter((p) => p.inStock && p.category === "engine")
    .map((p) => p.price);

  if (prices.length === 0) return 0;
  const total = prices.reduce((sum, price) => sum + price, 0);
  return Math.round(total / prices.length);
}

function cartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function cartItemCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartTotals(cart) {
  const subtotal = cartSubtotal(cart);
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 25000;
  const grand = Math.round(subtotal + tax + shipping);
  return { subtotal, tax, shipping, grand };
}

function buildAnalyticsReport() {
  const report = [
    "== forEach: full catalog ==",
    listAllProducts(PRODUCTS),
    "",
    "== filter: in-stock products ==",
    inStockOnly(PRODUCTS).map((p) => p.name).join(", "),
    "",
    "== filter: items Rp 200.000 or under ==",
    affordable(PRODUCTS, 200000).map((p) => `${p.name} (${formatIDR(p.price)})`).join(", "),
    "",
    "== map: price with 8% tax (first 3) ==",
    JSON.stringify(withTax(PRODUCTS).slice(0, 3), null, 2),
    "",
    "== reduce: in-stock inventory value ==",
    formatIDR(inStockInventoryValue(PRODUCTS)),
    "",
    "== reduce: products per category ==",
    JSON.stringify(countByCategory(PRODUCTS)),
    "",
    "== reduce: highest-rated product ==",
    (() => {
      const t = topRated(PRODUCTS);
      return `${t.name} (${t.rating}★)`;
    })(),
    "",
    "== filter + map + reduce: avg in-stock engine price ==",
    formatIDR(avgInStockEnginePrice(PRODUCTS)),
  ];
  return report.join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("run-analytics");
  const out = document.getElementById("analytics-output");
  if (!btn || !out) return;

  btn.addEventListener("click", () => {
    const report = buildAnalyticsReport();
    out.textContent = report;
    console.log(report);
  });
});
