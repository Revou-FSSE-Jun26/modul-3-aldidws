import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = path.resolve(__dirname, '..');

const TEST_EMAIL = process.env.TEST_EMAIL || 'testuser@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'password123';
const HAS_TEST_CREDS = TEST_EMAIL !== 'testuser@example.com';

// Log in for real through the login form (needed because the Header verifies the
// token live and wipes any fabricated seed).
async function loginWithCreds(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });
}

// Seed a localStorage session so protected client routes render their own page
// (and thus apply their route-specific <title> metadata) on load instead of
// bouncing to /login before the title is set. This is sufficient for the A7 title
// checks because the per-route title comes from the server layout's metadata,
// emitted regardless of the later client-side auth verification. (It is NOT enough
// for the ProductCard add-to-cart UI — see the note above loginWithCreds.)
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

async function clearAuth(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  });
}

test.describe('Bug Condition Exploration (UNFIXED code — these SHOULD fail)', () => {
  // ── R3 — Catalog does not compose a ProductGrid ──────────────────────────
  test('R3: /products renders a ProductGrid and no HeroSlider', async ({ page }) => {
    await page.goto('/products');

    // Expected (fixed): a dedicated ProductGrid wraps the cards, exposed via a stable
    // test id on the fixed component. On unfixed code no ProductGrid exists.
    await expect(
      page.getByTestId('product-grid'),
      'expected a ProductGrid container on /products (none exists on unfixed code)',
    ).toBeVisible({ timeout: 15000 });

    // Expected (fixed): the hero is home-only. On unfixed code HeroSlider renders here.
    await expect(
      page.getByTestId('hero-slider'),
      'expected NO hero on /products (unfixed code renders HeroSlider here)',
    ).toHaveCount(0);
  });

  // ── R6 (quantity) — quantity counter missing, add always sends 1 ─────────
  test('R6 quantity: selecting qty 3 then Add to Cart stores quantity 3', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    await loginWithCreds(page, TEST_EMAIL, TEST_PASSWORD);
    await page.goto('/products');

    // First in-stock card whose authenticated controls are present.
    const firstCard = page
      .locator('article')
      .filter({ hasText: /In stock/i })
      .first();
    await expect(firstCard).toBeVisible({ timeout: 20000 });

    // Expected (fixed): visible +/- controls let the user raise the quantity to 3.
    // On unfixed code there are no such controls, so this increment fails.
    const increment = firstCard.getByRole('button', { name: /increase quantity/i });
    await expect(increment, 'authenticated card should expose quantity controls').toBeVisible({
      timeout: 20000,
    });
    await increment.click();
    await increment.click(); // 1 -> 2 -> 3

    await firstCard.getByRole('button', { name: /^Add to Cart$/i }).click();

    // The cart is persisted via an effect, so poll until the stored quantity settles.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const raw = localStorage.getItem('cart');
            if (!raw) return null;
            const items = JSON.parse(raw) as Array<{ quantity: number }>;
            return items[0]?.quantity ?? null;
          }),
        {
          message: 'cart should contain the chosen quantity 3, not the fixed default 1',
          timeout: 5000,
        },
      )
      .toBe(3);
  });

  // ── R6 (mobile) — add-to-cart block hidden below md (hidden md:block) ────
  test('R6 mobile: add-to-cart block is visible below the md breakpoint', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    // Below Tailwind's md breakpoint (768px).
    await page.setViewportSize({ width: 375, height: 800 });
    await loginWithCreds(page, TEST_EMAIL, TEST_PASSWORD);
    await page.goto('/products');

    const firstCard = page
      .locator('article')
      .filter({ hasText: /In stock/i })
      .first();
    await expect(firstCard).toBeVisible({ timeout: 20000 });

    // Expected (fixed): the add-to-cart action is visible on mobile. On unfixed code
    // the block is `hidden md:block`, so it is display:none below md.
    await expect(
      firstCard.getByRole('button', { name: /^Add to Cart$/i }),
      'add-to-cart action should be visible on a mobile viewport',
    ).toBeVisible({ timeout: 20000 });
  });

  // ── R8 — search does not filter live ─────────────────────────────────────
  test('R8: typing in the header search updates ?q= live without submitting', async ({ page }) => {
    await page.goto('/products');

    const search = page.getByRole('searchbox').first();
    await expect(search).toBeVisible({ timeout: 15000 });

    // Type without pressing Enter / submitting the form. Focus first, then type
    // slowly enough that each keystroke registers before the ~300ms debounce fires
    // and triggers a router navigation (a navigation mid-keystroke can otherwise
    // drop a character from the controlled input).
    await search.click();
    await search.pressSequentially('engine', { delay: 120 });

    // Expected (fixed): a ~300ms debounce pushes ?q=engine onto /products while typing.
    // On unfixed code nothing happens until submit, so the URL never gains ?q=.
    await expect(
      page,
      'URL should gain ?q=engine from live (debounced) typing, without a submit',
    ).toHaveURL(/[?&]q=engine\b/, { timeout: 4000 });
  });

  // ── A1 — auth routes not at /login and /register ─────────────────────────
  test('A1: GET /login resolves (does not 404)', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response, 'navigation to /login should produce a response').not.toBeNull();
    // Expected (fixed): /login serves the login page (200). On unfixed code it 404s
    // because the page lives at /auth/login.
    expect(response!.status(), '/login should not 404').toBeLessThan(400);
    // The login page's heading copy is "Welcome back" — assert the real page
    // actually rendered (i.e. /login served the login page, not a 404 shell).
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('A1: GET /register resolves (does not 404)', async ({ page }) => {
    const response = await page.goto('/register');
    expect(response, 'navigation to /register should produce a response').not.toBeNull();
    expect(response!.status(), '/register should not 404').toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });

  // ── A7 — per-route tab titles missing (bare "RevoShop") ──────────────────
  const titleCases: Array<{ path: string; title: RegExp }> = [
    { path: '/cart', title: /Cart \| RevoShop/ },
    { path: '/checkout', title: /Checkout \| RevoShop/ },
    { path: '/orders', title: /Orders \| RevoShop/ },
    { path: '/profile', title: /Profile \| RevoShop/ },
  ];

  for (const { path: routePath, title } of titleCases) {
    test(`A7: ${routePath} sets a route-specific tab title`, async ({ page }) => {
      // Seed auth so protected pages render rather than bouncing to login before the
      // route's metadata/title is applied.
      await seedAuth(page);
      await page.goto(routePath);

      // Expected (fixed): "<Route> | RevoShop". On unfixed code the title is the bare
      // root default "RevoShop" because the route exports no metadata.
      await expect(
        page,
        `${routePath} should set a route-specific title, not the bare "RevoShop" default`,
      ).toHaveTitle(title, { timeout: 8000 });
    });
  }

  // ── F8 — guest loading /cart is not redirected on load ───────────────────
  test('F8: a guest loading /cart is redirected to /login on load', async ({ page }) => {
    await clearAuth(page);
    await page.goto('/cart');

    // Expected (fixed): guests are bounced to /login on load (consistent with /orders).
    // On unfixed code the cart renders and only redirects on the checkout click.
    await expect(
      page,
      'a guest should be redirected to /login when loading /cart',
    ).toHaveURL(/\/login(\?|$)/, { timeout: 6000 });
  });
});

// ── A10 — category/search filters not forwarded to the Flask API ───────────
//
// A10 is about the SERVER forwarding q/category to Flask. This is NOT observable
// through browser interception: page.route cannot see a Server Component's outbound
// fetch, this Next build refuses to run a second isolated dev server in the same
// project dir, and .env.local pins NEXT_PUBLIC_API_BASE_URL (so a process-env
// override is ignored). The bug is therefore reproduced at its source — the exact
// mechanism the design's isBugCondition names: getProducts is called with no params,
// so the request to Flask carries no query string "by construction".
//
// This reads the real source files (no mocks) and encodes the fixed behavior:
//   - getProducts must accept a filter argument (search / category), and
//   - app/products/page.tsx must pass the parsed q / category into getProducts(...).
// On unfixed code getProducts() takes only cacheOptions and the page calls
// getProducts() with no filters, so both assertions FAIL (bug confirmed). After task
// 8.2 wires the filters through, the SAME assertions PASS.
test.describe('A10 — filters forwarded to the API (source-level, deterministic)', () => {
  const API_SRC = path.join(PROJECT_ROOT, 'lib', 'api.ts');
  const PAGE_SRC = path.join(PROJECT_ROOT, 'app', 'products', 'page.tsx');

  test('A10: getProducts forwards q/category (source) and /products passes them', () => {
    const apiSrc = fs.readFileSync(API_SRC, 'utf8');
    const pageSrc = fs.readFileSync(PAGE_SRC, 'utf8');

    // 1) getProducts must accept a search/category filter, not just cacheOptions.
    //    Capture its parameter list.
    const sigMatch = apiSrc.match(/export\s+async\s+function\s+getProducts\s*\(([^)]*)\)/);
    expect(sigMatch, 'getProducts should be defined in lib/api.ts').not.toBeNull();
    const params = (sigMatch?.[1] ?? '').toLowerCase();
    // Accept singular or plural/typed filter param names (e.g. `filter`,
    // `filters`, `ProductFilters`, `search`, `category`, `query`, `params`).
    const acceptsFilter = /(search|category|query|filter|filters|params)/.test(params);
    expect(
      acceptsFilter,
      `getProducts should accept a search/category filter argument; its params were: "${(sigMatch?.[1] ?? '').trim()}"`,
    ).toBe(true);

    // 2) getProducts must actually append the filter to the /products request path/query.
    const buildsQuery =
      /\/products\?/.test(apiSrc) ||
      /URLSearchParams/.test(apiSrc) ||
      /`\/products\$\{/.test(apiSrc);
    expect(
      buildsQuery,
      'getProducts should build a /products request carrying the filter query string',
    ).toBe(true);

    // 3) The /products page must pass the parsed q / category into getProducts(...),
    //    not call it with no arguments.
    const callsWithFilter = /getProducts\s*\(\s*[^)]*\b(q|query|search|category)\b/i.test(pageSrc);
    const callsBare = /getProducts\s*\(\s*\)/.test(pageSrc);
    expect(
      callsWithFilter && !callsBare,
      'app/products/page.tsx should call getProducts with the q/category filters, not getProducts()',
    ).toBe(true);
  });
});
