import type { Page, Route } from '@playwright/test';
import { products, categories, orders, users } from './fixtures';

const API_GLOB = '**/revo-otoshop.onrender.com/**';

function json(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

export interface AuthMockOptions {
  role?: 'admin' | 'customer';
  failWith?: { status: number; message: string };
  offline?: boolean;
}

export async function mockAuth(page: Page, options: AuthMockOptions = {}): Promise<void> {
  const { role = 'customer', failWith, offline } = options;

  await page.route('**/login', async (route) => {
    if (offline) return route.abort('failed');
    if (failWith) return json(route, failWith.status, { message: failWith.message });
    return json(route, 200, {
      message: 'Login successful.',
      token: `mock-token-${role}`,
      user: { id: `user-${role}`, name: 'Mock User', email: 'mock@example.com', role },
    });
  });

  await page.route('**/register', async (route) => {
    if (offline) return route.abort('failed');
    if (failWith) return json(route, failWith.status, { message: failWith.message });
    return json(route, 201, {
      message: 'Registration successful.',
      token: `mock-token-${role}`,
      user: { id: `user-${role}`, name: 'Mock User', email: 'mock@example.com', role },
    });
  });

  await page.route('**/me', async (route) => {
    if (offline) return route.abort('failed');
    return json(route, 200, {
      user: { id: `user-${role}`, name: 'Mock User', email: 'mock@example.com', role },
    });
  });
}

export async function mockApi(page: Page): Promise<void> {
  await page.route(API_GLOB, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/\/$/, '') || '/';
    const method = request.method();

    if (method === 'GET' && path === '/products') return json(route, 200, { products });
    if (method === 'GET' && path.startsWith('/products/')) {
      const id = decodeURIComponent(path.slice('/products/'.length));
      const product = products.find((p) => p.id === id);
      return product
        ? json(route, 200, { product })
        : json(route, 404, { message: 'Product not found.' });
    }
    if (method === 'GET' && path === '/categories') return json(route, 200, { categories });
    if (method === 'GET' && path.startsWith('/categories/')) {
      const id = decodeURIComponent(path.slice('/categories/'.length));
      const category = categories.find((c) => c.id === id);
      return category
        ? json(route, 200, { category })
        : json(route, 404, { message: 'Category not found.' });
    }
    if (method === 'GET' && path === '/orders') return json(route, 200, { orders });
    if (method === 'GET' && path.startsWith('/orders/')) {
      const id = decodeURIComponent(path.slice('/orders/'.length));
      const order = orders.find((o) => String(o.id) === id);
      return order
        ? json(route, 200, { order })
        : json(route, 404, { message: 'Order not found.' });
    }

    if (method === 'POST' && path === '/login') {
      return json(route, 200, {
        message: 'Login successful.',
        token: 'mock-token-customer',
        user: users[1] ? { ...users[1], password: undefined } : {},
      });
    }

    return route.continue();
  });
}

export { products, categories, orders, users };
