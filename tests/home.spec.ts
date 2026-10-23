import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('shows the welcome heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Welcome to Revo Otoshop' }),
    ).toBeVisible();
  });

  test('shows the featured products section', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Featured product' }),
    ).toBeVisible();
  });

  test('"View all" links to the products page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View all/ }).click();
    await expect(page).toHaveURL(/\/products/);
    await expect(
      page.getByRole('heading', { name: 'Product Catalog' }),
    ).toBeVisible();
  });
});
