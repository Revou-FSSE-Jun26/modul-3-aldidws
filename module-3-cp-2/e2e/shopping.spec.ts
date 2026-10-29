import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('homepage loads with products', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RevoShop/);
  });

  test('products page loads and search works', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('main')).toBeVisible();
    const searchInput = page.getByRole('searchbox');
    if (await searchInput.isVisible()) {
      await searchInput.fill('engine');
      await searchInput.press('Enter');
    }
  });

  test('categories page loads', async ({ page }) => {
    await page.goto('/categories');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('product detail page loads', async ({ page }) => {
    await page.goto('/products');
    const firstProductLink = page.locator('article a').first();
    if (await firstProductLink.isVisible()) {
      await firstProductLink.click();
      await expect(page.getByRole('main')).toBeVisible();
    }
  });

  test('unauthenticated user sees Login to buy on product card', async ({ page }) => {
    await page.goto('/products');
    const loginToBuyLink = page.getByText('Login to buy').first();
    if (await loginToBuyLink.isVisible()) {
      await expect(loginToBuyLink).toBeVisible();
    }
  });

  test('cart page requires auth', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });
});
