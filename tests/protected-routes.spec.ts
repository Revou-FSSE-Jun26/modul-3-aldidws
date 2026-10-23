import { test, expect } from '@playwright/test';

test.describe('Protected routes (guest access)', () => {
  test('Orders redirects a guest to login', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('Profile redirects a guest to login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
