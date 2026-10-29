import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || 'testuser@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'password123';

test.describe('Authentication', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('login form shows error on wrong credentials', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('[aria-live="polite"]')).toBeVisible({ timeout: 10000 });
  });

  test('register page is accessible', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });

  test('unauthenticated user is redirected from /cart to login', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('unauthenticated user is redirected from /checkout to login', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });

  test('unauthenticated user is redirected from /orders to login', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });
});
