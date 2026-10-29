import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/auth/login');
  await page.fill('#email', ADMIN_EMAIL);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}

test.describe('Admin Dashboard', () => {
  test('unauthenticated user is redirected from /dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });

  test.describe('when logged in as admin', () => {
    test.beforeEach(async ({ page }) => {
      // Skip if no admin credentials configured
      if (ADMIN_EMAIL === 'admin@example.com') {
        test.skip();
      }
      await loginAsAdmin(page);
    });

    test('dashboard page loads', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('products management page loads', async ({ page }) => {
      await page.goto('/dashboard/products');
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('categories management page loads', async ({ page }) => {
      await page.goto('/dashboard/categories');
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('orders management page loads', async ({ page }) => {
      await page.goto('/dashboard/orders');
      await expect(page.getByRole('main')).toBeVisible();
    });
  });
});
