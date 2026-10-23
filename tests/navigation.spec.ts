import { test, expect } from '@playwright/test';

test.describe('Primary navigation', () => {
  test('brand link returns to home', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('link', { name: 'Revo Otoshop' }).click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('navigates to Products', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL(/\/products/);
    await expect(
      page.getByRole('heading', { name: 'Product Catalog' }),
    ).toBeVisible();
  });

  test('navigates to Categories', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Categories' }).click();
    await expect(page).toHaveURL(/\/categories/);
    await expect(
      page.getByRole('heading', { name: 'Category', exact: true }),
    ).toBeVisible();
  });

  test('navigates to Cart', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Cart' }).click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible();
  });

  test('shows the Login link when signed out', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  test('Login link opens the login page', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});
