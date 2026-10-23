// --- Categories ------------------------------------------------------------

export const categories = [
  { id: 'cat-oil', name: 'Engine Oil', description: 'Lubricants and engine oils.' },
  { id: 'cat-tires', name: 'Tires', description: 'Tires for every vehicle.' },
  { id: 'cat-battery', name: 'Batteries', description: 'Car and motorcycle batteries.' },
];

// --- Products --------------------------------------------------------------

export const products = [
  {
    id: 'prod-1',
    name: 'Synthetic Engine Oil 5W-30',
    description: 'Fully synthetic engine oil, 4 litres.',
    price: '150000',
    stock: 25,
    category_name: 'Engine Oil',
    image_url: null,
  },
  {
    id: 'prod-2',
    name: 'Mineral Engine Oil 10W-40',
    description: 'Reliable mineral engine oil, 1 litre.',
    price: 55000,
    stock: 3,
    category_name: 'Engine Oil',
    image_url: null,
  },
  {
    id: 'prod-3',
    name: 'All-Season Tire 185/65 R15',
    description: 'Durable all-season tire.',
    price: '720000',
    stock: 12,
    category_name: 'Tires',
    image_url: null,
  },
  {
    id: 'prod-4',
    name: 'Maintenance-Free Battery 12V 45Ah',
    description: 'Sealed maintenance-free battery.',
    price: 640000,
    stock: 0,
    category_name: 'Batteries',
    image_url: null,
  },
];

// --- Users -----------------------------------------------------------------

export const users = [
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin12345',
  },
  {
    id: 'user-customer',
    name: 'Budi Santoso',
    email: 'customer@example.com',
    role: 'customer',
    password: 'customer12345',
  },
];

// --- Orders ----------------------------------------------------------------

export const orders = [
  {
    id: 'order-1001',
    order_number: 'INV-1001',
    customer_name: 'Budi Santoso',
    total: '305000',
    status: 'completed',
    created_at: '2026-01-10T08:30:00.000Z',
    recipient_name: 'Budi Santoso',
    recipient_phone: '081234567890',
    shipping_address: 'Jl. Mawar No. 1',
    shipping_city: 'Jakarta',
    shipping_province: 'DKI Jakarta',
    shipping_postal_code: '12345',
    customer_note: null,
    items: [
      { product_id: 'prod-1', product_name: 'Synthetic Engine Oil 5W-30', quantity: 2, price: '150000' },
      { product_id: 'prod-2', product_name: 'Mineral Engine Oil 10W-40', quantity: 1, price: '55000' },
    ],
  },
  {
    id: 'order-1002',
    order_number: 'INV-1002',
    customer_name: 'Budi Santoso',
    total: '720000',
    status: 'processing',
    created_at: '2026-02-02T10:15:00.000Z',
    recipient_name: 'Budi Santoso',
    recipient_phone: '081234567890',
    shipping_address: 'Jl. Melati No. 9',
    shipping_city: 'Bandung',
    shipping_province: 'Jawa Barat',
    shipping_postal_code: '40123',
    customer_note: 'Please deliver before noon.',
    items: [
      { product_id: 'prod-3', product_name: 'All-Season Tire 185/65 R15', quantity: 1, price: '720000' },
    ],
  },
];

export function cloneFixtures() {
  return {
    categories: structuredClone(categories),
    products: structuredClone(products),
    users: structuredClone(users),
    orders: structuredClone(orders),
  };
}
