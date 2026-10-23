import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('empty cart shows the "nothing to check out" prompt', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    await expect(
      page.getByText('Your cart is empty, so there is nothing to check out.'),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Browse products' }),
    ).toBeVisible();
  });

  test('with items, the shipping form and summary render', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /^Add to Cart/ }).first().click();

    await page.goto('/checkout');
    await expect(
      page.getByRole('heading', { name: 'Shipping details' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Order summary' }),
    ).toBeVisible();
    await expect(page.locator('#recipient_name')).toBeVisible();
    await expect(page.locator('#shipping_address')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Place order' }),
    ).toBeVisible();
  });

  test('submitting an empty form shows validation errors', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /^Add to Cart/ }).first().click();

    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(
      page.getByText('Recipient name is required.'),
    ).toBeVisible();
    await expect(page.getByText('A phone number is required.')).toBeVisible();
    await expect(
      page.getByText('A shipping address is required.'),
    ).toBeVisible();
  });

  test('invalid phone and postal code are rejected', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /^Add to Cart/ }).first().click();

    await page.goto('/checkout');
    await page.locator('#recipient_name').fill('Budi');
    await page.locator('#recipient_phone').fill('abc');
    await page.locator('#shipping_address').fill('Jl. Mawar 1');
    await page.locator('#shipping_city').fill('Jakarta');
    await page.locator('#shipping_province').fill('DKI');
    await page.locator('#shipping_postal_code').fill('xy');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page.getByText('Enter a valid phone number.')).toBeVisible();
    await expect(page.getByText('Enter a valid postal code.')).toBeVisible();
  });

  test('a valid form for a guest redirects to login', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /^Add to Cart/ }).first().click();

    await page.goto('/checkout');
    await page.locator('#recipient_name').fill('Budi Santoso');
    await page.locator('#recipient_phone').fill('081234567890');
    await page.locator('#shipping_address').fill('Jl. Mawar No. 1');
    await page.locator('#shipping_city').fill('Jakarta');
    await page.locator('#shipping_province').fill('DKI Jakarta');
    await page.locator('#shipping_postal_code').fill('12345');
    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page).toHaveURL(/\/auth\/login\?redirect=/);
  });

  test('"Back to cart" returns to the cart page', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('button', { name: /^Add to Cart/ }).first().click();

    await page.goto('/checkout');
    await page.getByRole('link', { name: /Back to cart/ }).click();
    await expect(page).toHaveURL(/\/cart/);
  });
});
