import { test, expect, type Page } from '@playwright/test';

async function loginAsAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.locator('#email').fill('admin@example.com');
  await page.locator('#password').fill('admin12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Admin dashboard products', () => {
  test('admin can create, edit and delete a product', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/products');

    // --- Create -----------------------------------------------------------
    const name = `E2E Widget ${Date.now()}`;
    await page.locator('#name').fill(name);
    await page.locator('#price').fill('99000');
    await page.locator('#stock').fill('7');
    await page.getByRole('button', { name: 'Save Product' }).click();

    // The server-rendered listing refreshes and shows the new product.
    const productLink = page.getByRole('link', { name });
    await expect(productLink).toBeVisible();

    // The listing links to /products/:id — reuse the id for the dashboard
    // detail page where the Edit/Delete forms live.
    const href = await productLink.getAttribute('href');
    const id = href?.split('/').pop();
    expect(id).toBeTruthy();

    // --- Edit -------------------------------------------------------------
    await page.goto(`/dashboard/products/${id}`);
    await expect(
      page.getByRole('heading', { name: 'Edit Product' }),
    ).toBeVisible();
    await page.locator('#price').fill('123000');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Changes saved.')).toBeVisible();
    // The new price is reflected in the product preview card.
    await expect(page.getByText('Rp 123.000').first()).toBeVisible();

    // --- Delete -----------------------------------------------------------
    await page
      .getByRole('button', { name: 'Delete Product' })
      .first()
      .click();
    await page.getByRole('button', { name: 'Yes, delete' }).click();

    // Redirects back to the listing and the product is gone.
    await expect(page).toHaveURL(/\/dashboard\/products$/);
    await expect(page.getByRole('link', { name })).toHaveCount(0);
  });

  test('deleting a product with active orders shows the 409 message', async ({
    page,
  }) => {
    await loginAsAdmin(page);
    // prod-3 is referenced by the processing order-1002 in the mock fixtures.
    await page.goto('/dashboard/products/prod-3');
    await expect(
      page.getByRole('heading', { name: 'Delete Product' }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: 'Delete Product' })
      .first()
      .click();
    await page.getByRole('button', { name: 'Yes, delete' }).click();

    // The backend 409 message is shown inline in the delete form (it also
    // appears as a toast, so scope the assertion to the main content).
    await expect(
      page
        .getByRole('main')
        .getByText('This product has active orders and cannot be deleted.'),
    ).toBeVisible();
  });
});
