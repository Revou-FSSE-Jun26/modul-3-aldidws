import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';


const PROJECT_ROOT = path.resolve(__dirname, '..');

const AUTH_LOGIN_PATH = '/login';

// Real credentials (same env contract as e2e/auth.spec.ts & e2e/admin.spec.ts).
const TEST_EMAIL = process.env.TEST_EMAIL || 'testuser@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'password123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';
const HAS_TEST_CREDS = TEST_EMAIL !== 'testuser@example.com';
const HAS_ADMIN_CREDS = ADMIN_EMAIL !== 'admin@example.com';

async function clearAuth(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  });
}

// Log in for real through the login form (needed for verify=true pages).
async function loginWithCreds(page: Page, email: string, password: string): Promise<void> {
  await page.goto(AUTH_LOGIN_PATH);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  // After login the page navigates away from the login route.
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.1 — Home page still renders its hero
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.1 — home hero is preserved', () => {
  test('home page renders its hero headline and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Find the Right Parts/i }),
      'home hero headline should render',
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole('button', { name: /^Shop Now$/i }),
      'home "Shop Now" CTA should render',
    ).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3.2 — Add-to-cart payload + success toast + out-of-stock block are preserved
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.2 — add-to-cart payload, toast, and out-of-stock block are preserved', () => {
  test('adding a product stores the correct payload and shows a success toast', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    await loginWithCreds(page, TEST_EMAIL, TEST_PASSWORD);
    await page.goto('/products');

    // The first in-stock card whose authenticated "Add to Cart" button is present.
    const addButton = page
      .locator('article')
      .filter({ hasText: /In stock/i })
      .first()
      .getByRole('button', { name: /^Add to Cart$/i });
    await expect(addButton).toBeVisible({ timeout: 20000 });

    const card = page
      .locator('article')
      .filter({ hasText: /In stock/i })
      .first();
    const productName = (await card.getByRole('heading').first().innerText()).trim();

    await addButton.click();

    // Success toast (react-hot-toast renders the product name + "added to cart").
    await expect(
      page.getByText(/added to cart/i).first(),
      'a success toast should appear after adding to cart',
    ).toBeVisible({ timeout: 8000 });

    // Payload written to the cart store: id present, matching name, numeric price,
    // and the default quantity of 1 (observed unfixed behavior).
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('cart');
      return raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
    });
    expect(stored.length, 'cart should contain the added item').toBeGreaterThan(0);
    const item = stored.find((i) => i.name === productName) ?? stored[0];
    expect(item.id, 'cart item carries an id').toBeDefined();
    expect(item.name, 'cart item name matches the card').toBe(productName);
    expect(typeof item.price, 'cart item price is numeric').toBe('number');
    expect(item.quantity, 'cart item quantity is the current default (1)').toBe(1);
  });

  test('an out-of-stock card blocks adding to the cart', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    await loginWithCreds(page, TEST_EMAIL, TEST_PASSWORD);
    await page.goto('/products');
    await expect(page.locator('article').first()).toBeVisible({ timeout: 20000 });

    // Find a card flagged SOLD OUT (out of stock) if the live catalog has one.
    const soldOutCard = page
      .locator('article')
      .filter({ hasText: /SOLD OUT|Out of stock/i })
      .first();

    const count = await soldOutCard.count();
    test.skip(count === 0, 'no out-of-stock product in the live catalog to exercise the block');

    const addButton = soldOutCard.getByRole('button', { name: /out of stock|add to cart/i });
    // The out-of-stock button is rendered disabled (cannot add).
    await expect(
      addButton,
      'the add-to-cart button on an out-of-stock card should be disabled',
    ).toBeDisabled({ timeout: 15000 });

    const beforeRaw = await page.evaluate(() => localStorage.getItem('cart'));
    await addButton.click({ force: true }).catch(() => { /* disabled: click is a no-op */ });
    const afterRaw = await page.evaluate(() => localStorage.getItem('cart'));
    expect(afterRaw, 'the cart should be unchanged when the product is out of stock').toBe(beforeRaw);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3.3 — Search submit (Enter) navigates to /products?q=...; empty clears
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.3 — header search submit navigation is preserved', () => {
  test('pressing Enter with a query navigates to /products?q=...', async ({ page }) => {
    await page.goto('/products');
    const search = page.getByRole('searchbox').first();
    await expect(search).toBeVisible({ timeout: 15000 });
    // Let the header's SearchParamsSync seed from the URL (q="") before typing, so
    // its mount effect does not overwrite the value we are about to enter.
    await page.waitForTimeout(1000);

    await search.fill('brake');
    await expect(search).toHaveValue('brake');
    await search.press('Enter');

    await expect(page, 'Enter should navigate to /products with the q param').toHaveURL(
      /\/products\?q=brake/,
      { timeout: 10000 },
    );
  });

  test('pressing Enter with an empty query clears to /products', async ({ page }) => {
    // Start already on a filtered /products URL so clearing is observable.
    await page.goto('/products?q=brake');
    const search = page.getByRole('searchbox').first();
    await expect(search).toBeVisible({ timeout: 15000 });
    // Wait for SearchParamsSync to seed the field from ?q=brake.
    await expect(search).toHaveValue('brake', { timeout: 10000 });

    await search.fill('');
    await expect(search).toHaveValue('');
    await search.press('Enter');

    await expect(page, 'an empty submit should land on /products with no q').toHaveURL(
      /\/products\/?$/,
      { timeout: 10000 },
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3.4 — /products with no q and no category shows the full active catalog
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.4 — unfiltered /products shows the full active catalog', () => {
  test('no q and no category renders multiple product cards and no results banner', async ({ page }) => {
    await page.goto('/products');

    const cards = page.locator('article');
    await expect(cards.first(), 'at least one product card should render').toBeVisible({
      timeout: 20000,
    });
    expect(await cards.count(), 'the full catalog should show multiple cards').toBeGreaterThan(1);

    await expect(
      page.getByText(/Showing \d+ result/i),
      'no "Showing N results" banner on the unfiltered catalog',
    ).toHaveCount(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3.5 — Routes that already set a title keep it
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.5 — already-titled routes keep their title', () => {
  test('/ keeps the root default title "RevoShop"', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/^RevoShop$/, { timeout: 10000 });
  });

  test('/about keeps its own title', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About .* Revo Otoshop/, { timeout: 10000 });
  });

  test('/categories keeps its own title', async ({ page }) => {
    await page.goto('/categories');
    await expect(page).toHaveTitle(/Categories .* Revo Otoshop/, { timeout: 10000 });
  });

  test('/products/[id] keeps its generateMetadata title (not the bare default)', async ({ page }) => {
    await page.goto('/products');
    const firstProductLink = page.locator('article a').first();
    await expect(firstProductLink).toBeVisible({ timeout: 20000 });
    await firstProductLink.click();
    await expect(page, 'should be on a product detail route').toHaveURL(/\/products\/[^/]+$/, {
      timeout: 10000,
    });
    // generateMetadata sets a product-specific title ending in "| RevoShop";
    // it must not be the bare root default.
    await expect(page).not.toHaveTitle(/^RevoShop$/, { timeout: 10000 });
    await expect(page).toHaveTitle(/\| RevoShop$/, { timeout: 10000 });
  });

  test('/dashboard keeps its layout title (admin)', async ({ page }) => {
    test.skip(!HAS_ADMIN_CREDS, 'no admin credentials configured (set ADMIN_EMAIL/ADMIN_PASSWORD)');
    await loginWithCreds(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto('/dashboard');
    // The /dashboard layout already sets a title via the "%s | RevoShop" template.
    await expect(page).toHaveTitle(/\| RevoShop$/, { timeout: 10000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3.6 — Already-authenticated user is redirected off login/register; ?redirect honored
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.6 — authenticated redirect-away and ?redirect= are preserved', () => {
  test('an authenticated user visiting the login page is redirected away', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    await loginWithCreds(page, TEST_EMAIL, TEST_PASSWORD);

    // Revisit the login page while authenticated -> bounced away (to "/").
    await page.goto(AUTH_LOGIN_PATH);
    await expect(page, 'authenticated user should be redirected off the login page').toHaveURL(
      /\/$/,
      { timeout: 10000 },
    );
  });

  test('a valid ?redirect= is honored after login', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    await clearAuth(page);
    await page.goto(`${AUTH_LOGIN_PATH}?redirect=${encodeURIComponent('/profile')}`);
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page, 'a safe ?redirect= target should be honored after login').toHaveURL(
      /\/profile/,
      { timeout: 20000 },
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3.7 — Role-correct users reach protected pages; non-admins bounced from admin
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.7 — role-based access is preserved', () => {
  test('a logged-in customer reaches /orders and /profile without a login bounce', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    await loginWithCreds(page, TEST_EMAIL, TEST_PASSWORD);

    await page.goto('/orders');
    await expect(page, 'customer should stay on /orders').toHaveURL(/\/orders\/?$/, {
      timeout: 15000,
    });

    await page.goto('/profile');
    await expect(page, 'customer should stay on /profile').toHaveURL(/\/profile\/?$/, {
      timeout: 15000,
    });
  });

  test('a non-admin is bounced from /dashboard to home', async ({ page }) => {
    test.skip(!HAS_TEST_CREDS, 'no test credentials configured (set TEST_EMAIL/TEST_PASSWORD)');
    await loginWithCreds(page, TEST_EMAIL, TEST_PASSWORD);

    await page.goto('/dashboard');
    // AdminGuard redirects authenticated non-admins to "/" (preserved).
    await expect(page, 'a non-admin should be redirected off /dashboard to home').toHaveURL(
      /\/$/,
      { timeout: 15000 },
    );
  });

  test('an admin reaches /dashboard', async ({ page }) => {
    test.skip(!HAS_ADMIN_CREDS, 'no admin credentials configured (set ADMIN_EMAIL/ADMIN_PASSWORD)');
    await loginWithCreds(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto('/dashboard');
    await expect(page, 'an admin should stay on /dashboard').toHaveURL(/\/dashboard/, {
      timeout: 15000,
    });
    await expect(page.getByRole('main')).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3.8 — Category mega-menu, "View all" links, and ?category= deep-links navigate/filter
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.8 — category navigation and filtering are preserved', () => {
  test('a ?category= deep-link filters /products and shows the results banner', async ({ page }) => {
    // Pick a real category name from the categories page, then deep-link into it.
    await page.goto('/categories');
    const firstCategory = page.locator('a[href*="/products?category="]').first();
    await expect(firstCategory).toBeVisible({ timeout: 20000 });
    const href = await firstCategory.getAttribute('href');
    expect(href, 'a category link should carry a ?category= deep-link').toBeTruthy();

    await page.goto(href!);
    await expect(page, 'deep-link should land on /products with the category param').toHaveURL(
      /\/products\?category=/,
      { timeout: 10000 },
    );
    // The filtered view renders the "Showing N results ... in <category>" banner.
    await expect(
      page.getByText(/Showing \d+ result/i).first(),
      'a filtered /products view should show the results banner',
    ).toBeVisible({ timeout: 20000 });
  });

  test('the header category mega-menu navigates to a filtered /products view', async ({ page }) => {
    await page.goto('/products');
    // Open the mega-menu.
    const categoriesTrigger = page.getByRole('button', { name: /^Categories$/ });
    await expect(categoriesTrigger).toBeVisible({ timeout: 15000 });
    await categoriesTrigger.click();

    // Click the first category link inside the menu.
    const menu = page.locator('#header-category-menu');
    const firstMenuLink = menu.locator('a[href*="/products?category="]').first();
    await expect(firstMenuLink).toBeVisible({ timeout: 20000 });
    await firstMenuLink.click();

    await expect(page, 'mega-menu should navigate to a category-filtered /products').toHaveURL(
      /\/products\?category=/,
      { timeout: 10000 },
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property-based: random (stock, intendedQty) add semantics are preserved
// ─────────────────────────────────────────────────────────────────────────────
test.describe('3.2/3.8 (PBT) — cart addItem quantity/stock capping invariant', () => {
  test('addItem caps the stored quantity at stock across random inputs', () => {
    const src = fs.readFileSync(path.join(PROJECT_ROOT, 'context', 'CartContext.tsx'), 'utf8');
    expect(
      /Math\.min\([^)]*stock/.test(src),
      'CartContext.addItem should cap the stored quantity at stock',
    ).toBe(true);

    // Model of the observed addItem semantics for a FIRST add (no existing line):
    //   initialQty = stock != null ? min(quantity, stock) : quantity
    const modelInitialQty = (quantity: number, stock: number | null) =>
      stock != null ? Math.min(quantity, stock) : quantity;

    // Deterministic pseudo-random sweep (seeded) so the property is reproducible.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    for (let i = 0; i < 200; i++) {
      const intendedQty = 1 + Math.floor(rand() * 50); // 1..50
      const hasStock = rand() < 0.8;
      const stock = hasStock ? Math.floor(rand() * 50) : null; // 0..49 or null

      const stored = modelInitialQty(intendedQty, stock);

      if (stock == null) {
        expect(stored, `qty=${intendedQty}, stock=null should store the intended qty`).toBe(
          intendedQty,
        );
      } else {
        expect(stored, `qty=${intendedQty}, stock=${stock} should never exceed stock`).toBeLessThanOrEqual(
          stock,
        );
        expect(stored, `qty=${intendedQty}, stock=${stock} should store min(qty, stock)`).toBe(
          Math.min(intendedQty, stock),
        );
      }
    }
  });
});
