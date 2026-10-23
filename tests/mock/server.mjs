import { createServer } from 'node:http';
import { cloneFixtures } from './fixtures.mjs';

const PORT = Number(process.env.MOCK_API_PORT ?? 4000);

const state = cloneFixtures();

const tokensByUser = new Map();
const userByToken = new Map();

function tokenFor(user) {
  const existing = tokensByUser.get(user.id);
  if (existing) return existing;
  const token = `mock-token-${user.id}-${Date.now().toString(36)}`;
  tokensByUser.set(user.id, token);
  userByToken.set(token, user);
  return token;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

function bearer(req) {
  const header = req.headers['authorization'];
  if (!header || Array.isArray(header)) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return null;
  return userByToken.get(match[1]) ?? null;
}

function str(value) {
  return typeof value === 'string' ? value : '';
}

const server = createServer(async (req, res) => {
  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname.replace(/\/$/, '') || '/';

  // CORS preflight.
  if (method === 'OPTIONS') {
    send(res, 204, {});
    return;
  }

  // --- Health ------------------------------------------------------------
  if (method === 'GET' && path === '/health') {
    send(res, 200, { status: 'ok' });
    return;
  }

  // --- Products ----------------------------------------------------------
  if (method === 'GET' && path === '/products') {
    send(res, 200, { products: state.products });
    return;
  }
  if (method === 'GET' && path.startsWith('/products/')) {
    const id = decodeURIComponent(path.slice('/products/'.length));
    const product = state.products.find((p) => p.id === id);
    if (!product) {
      send(res, 404, { message: 'Product not found.' });
      return;
    }
    send(res, 200, { product });
    return;
  }

  // --- Categories --------------------------------------------------------
  if (method === 'GET' && path === '/categories') {
    send(res, 200, { categories: state.categories });
    return;
  }
  if (method === 'GET' && path.startsWith('/categories/')) {
    const id = decodeURIComponent(path.slice('/categories/'.length));
    const category = state.categories.find((c) => c.id === id);
    if (!category) {
      send(res, 404, { message: 'Category not found.' });
      return;
    }
    send(res, 200, { category });
    return;
  }

  // --- Auth: register ----------------------------------------------------
  if (method === 'POST' && path === '/register') {
    const body = await readJson(req);
    const name = str(body.name);
    const email = str(body.email).toLowerCase();
    const password = str(body.password);
    const confirmPassword = str(body.confirm_password);

    if (!name || !email || !password) {
      send(res, 400, { message: 'Name, email, and password are required.' });
      return;
    }
    if (password.length < 8) {
      send(res, 400, { message: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      send(res, 400, { message: 'Passwords do not match.' });
      return;
    }
    if (state.users.some((u) => u.email.toLowerCase() === email)) {
      send(res, 409, { message: 'An account with this email already exists.' });
      return;
    }

    const user = {
      id: `user-${state.users.length + 1}`,
      name,
      email,
      role: 'customer',
      password,
    };
    state.users.push(user);
    send(res, 201, {
      message: 'Registration successful.',
      user: publicUser(user),
      token: tokenFor(user),
    });
    return;
  }

  // --- Auth: login -------------------------------------------------------
  if (method === 'POST' && path === '/login') {
    const body = await readJson(req);
    const email = str(body.email).toLowerCase();
    const password = str(body.password);
    const user = state.users.find((u) => u.email.toLowerCase() === email);

    if (!user || user.password !== password) {
      send(res, 401, { message: 'Invalid email or password.' });
      return;
    }
    send(res, 200, {
      message: 'Login successful.',
      user: publicUser(user),
      token: tokenFor(user),
    });
    return;
  }

  // --- Auth: me ----------------------------------------------------------
  if (method === 'GET' && path === '/me') {
    const user = bearer(req);
    if (!user) {
      send(res, 401, { message: 'Unauthorized.' });
      return;
    }
    send(res, 200, { user: publicUser(user) });
    return;
  }

  // --- Orders ------------------------------------------------------------
  if (path === '/orders' && (method === 'GET' || method === 'POST')) {
    const user = bearer(req);
    if (!user) {
      send(res, 401, { message: 'Unauthorized.' });
      return;
    }

    if (method === 'GET') {
      // Admins see all orders; customers see their own.
      const visible =
        user.role === 'admin'
          ? state.orders
          : state.orders.filter((o) => o.recipient_name === user.name);
      send(res, 200, { orders: visible });
      return;
    }

    // POST: create an order from the submitted shipping + items payload.
    const body = await readJson(req);
    const shipping = body.shipping ?? {};
    const items = Array.isArray(body.items) ? body.items : [];

    const lineItems = items.map((item) => {
      const productId = item.product_id;
      const product = state.products.find((p) => p.id === productId);
      const quantity = Number(item.quantity ?? 1);
      return {
        product_id: productId,
        product_name: product?.name ?? 'Unknown product',
        quantity,
        price: product?.price ?? 0,
      };
    });

    const subtotal = lineItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );
    const shippingCost = Number(body.shipping_cost ?? 0);
    const discount = Number(body.discount ?? 0);
    const total = subtotal + shippingCost - discount;

    const newOrder = {
      id: `order-${1000 + state.orders.length + 1}`,
      order_number: `INV-${1000 + state.orders.length + 1}`,
      customer_name: str(shipping.recipient_name) || user.name,
      total,
      status: 'pending',
      created_at: new Date().toISOString(),
      recipient_name: str(shipping.recipient_name) || user.name,
      recipient_phone: str(shipping.recipient_phone),
      shipping_address: str(shipping.shipping_address),
      shipping_city: str(shipping.shipping_city),
      shipping_province: str(shipping.shipping_province),
      shipping_postal_code: str(shipping.shipping_postal_code),
      customer_note: str(body.customer_note) || null,
      items: lineItems,
    };
    state.orders.push(newOrder);
    send(res, 201, { order: newOrder });
    return;
  }

  if (method === 'GET' && path.startsWith('/orders/')) {
    const user = bearer(req);
    if (!user) {
      send(res, 401, { message: 'Unauthorized.' });
      return;
    }
    const id = decodeURIComponent(path.slice('/orders/'.length));
    const order = state.orders.find((o) => String(o.id) === id);
    if (!order) {
      send(res, 404, { message: 'Order not found.' });
      return;
    }
    send(res, 200, { order });
    return;
  }

  // --- Fallback ----------------------------------------------------------
  send(res, 404, { message: `No mock handler for ${method} ${path}.` });
});

server.listen(PORT, () => {
  console.log(`[mock-api] listening on http://localhost:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
