import { test, expect, type Page } from '@playwright/test';
async function seedAuth(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 1, name: 'Test User', email: 'testuser@example.com', role: 'customer' }),
    );
    localStorage.removeItem('cart');
  });
}

// ── A1 — auth routes resolve at /login and /register ─────────────────────────
test.describe('A1 — auth routes resolve inside the shared shell', () => {
  test('/login loads (200) and shows the login heading', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response, 'navigation to /login should produce a response').not.toBeNull();
    expect(response!.status(), '/login should not 404').toBeLessThan(400);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('/register loads (200) and shows the register heading', async ({ page }) => {
    const response = await page.goto('/register');
    expect(response, 'navigation to /register should produce a response').not.toBeNull();
    expect(response!.status(), '/register should not 404').toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });
});

// ── A7 — per-route tab titles ────────────────────────────────────────────────
test.describe('A7 — protected routes set a route-specific tab title', () => {
  const titleCases: Array<{ path: string; title: RegExp }> = [
    { path: '/cart', title: /Cart \| RevoShop/ },
    { path: '/checkout', title: /Checkout \| RevoShop/ },
    { path: '/orders', title: /Orders \| RevoShop/ },
    { path: '/profile', title: /Profile \| RevoShop/ },
  ];

  for (const { path: routePath, title } of titleCases) {
    test(`${routePath} sets "<Route> | RevoShop"`, async ({ page }) => {
      await seedAuth(page);
      await page.goto(routePath);
      await expect(
        page,
        `${routePath} should set a route-specific title, not the bare "RevoShop" default`,
      ).toHaveTitle(title, { timeout: 8000 });
    });
  }
});

// ── R8 — live (debounced) header search typing ───────────────────────────────
test.describe('R8 — header search filters live while typing', () => {
  test('typing in the searchbox on /products pushes ?q= without submitting', async ({ page }) => {
    await page.goto('/products');

    const search = page.getByRole('searchbox').first();
    await expect(search).toBeVisible({ timeout: 15000 });

    await search.click();
    await search.pressSequentially('engine', { delay: 120 });

    await expect(
      page,
      'URL should gain ?q=engine from live (debounced) typing, without a submit',
    ).toHaveURL(/[?&]q=engine\b/, { timeout: 4000 });
  });
});
