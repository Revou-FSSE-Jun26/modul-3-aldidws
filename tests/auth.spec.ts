import { test, expect } from '@playwright/test';
import { fillStable, gotoHydrated } from './helpers';

test.describe('Login page', () => {
  test('renders the login form', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('links to the register page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(
      page.getByRole('heading', { name: 'Create Account' }),
    ).toBeVisible();
  });

  test('invalid credentials surface an error without navigating', async ({
    page,
  }) => {
    await gotoHydrated(page, '/auth/login');
    await fillStable(page, '#email', 'nobody@example.com');
    await page.locator('#password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // Stays on the login page; an inline error is shown (API or connection).
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator('p.text-red-500')).toBeVisible();
  });
});

test.describe('Register page', () => {
  test('renders the registration form', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(
      page.getByRole('heading', { name: 'Create Account' }),
    ).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('rejects a password shorter than 8 characters', async ({ page }) => {
    await gotoHydrated(page, '/auth/register');
    await fillStable(page, '#name', 'Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('short');
    await page.locator('#confirmPassword').fill('short');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(
      page.getByText('Password must be at least 8 characters.'),
    ).toBeVisible();
  });

  test('rejects mismatched passwords', async ({ page }) => {
    await gotoHydrated(page, '/auth/register');
    await fillStable(page, '#name', 'Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('#confirmPassword').fill('password456');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(
      page.locator('p[aria-live="polite"]', {
        hasText: 'Passwords do not match.',
      }),
    ).toBeVisible();
  });

  test('links back to the login page', async ({ page }) => {
    await page.goto('/auth/register');
    await page.getByRole('main').getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('registering a new user logs them in', async ({ page }) => {
    await gotoHydrated(page, '/auth/register');
    await fillStable(page, '#name', 'New Customer');
    await page.locator('#email').fill(`new-${Date.now()}@example.com`);
    await page.locator('#password').fill('password123');
    await page.locator('#confirmPassword').fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Leaves the register page and lands logged in (customer -> home).
    await expect(page).not.toHaveURL(/\/auth\/register/);
    // Reload so the header re-reads the persisted session and shows the
    // authenticated controls (a Logout button replaces the Login link).
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Logout' }),
    ).toBeVisible();
  });
});
