import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('shows the empty state initially', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible();
    await expect(page.getByText('Your cart is empty.')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Browse products' }),
    ).toBeVisible();
  });

  test('"Browse products" from an empty cart opens the catalog', async ({
    page,
  }) => {
    await page.goto('/cart');
    await page.getByRole('link', { name: 'Browse products' }).click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('adding a product from the catalog fills the cart', async ({ page }) => {
    await page.goto('/products');

    const addButton = page
      .getByRole('button', { name: /^Add to Cart/ })
      .first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    const cartLink = page.getByRole('link', { name: /Cart/ });
    await expect(cartLink).toContainText(/\d/);

    await page.goto('/cart');
    await expect(page.getByText('Your cart is empty.')).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Proceed to checkout' }),
    ).toBeVisible();
  });

  test('quantity controls and clear work in the cart', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /^Add to Cart/ }).first().click();

    await page.goto('/cart');

    const increase = page
      .getByRole('button', { name: /Increase quantity of/ })
      .first();
    await increase.click();

    await page.getByRole('button', { name: 'Clear cart' }).click();
    await expect(page.getByText('Your cart is empty.')).toBeVisible();
  });

  test('checkout from the cart redirects guests to login', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /^Add to Cart/ }).first().click();

    await page.goto('/cart');
    await page.getByRole('button', { name: 'Proceed to checkout' }).click();

    await expect(page).toHaveURL(/\/auth\/login\?redirect=/);
  });
});
