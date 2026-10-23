import { test, expect } from '@playwright/test';

test.describe('Categories page', () => {
  test('renders the Category heading', async ({ page }) => {
    await page.goto('/categories');
    await expect(
      page.getByRole('heading', { name: 'Category', exact: true }),
    ).toBeVisible();
  });

  test('a category card links to a filtered products view', async ({
    page,
  }) => {
    await page.goto('/categories');

    const categoryLink = page.locator('a[href^="/products?category="]').first();

    if ((await categoryLink.count()) > 0) {
      await categoryLink.click();
      await expect(page).toHaveURL(/\/products\?category=/);
      await expect(
        page.getByRole('heading', { name: 'Product Catalog' }),
      ).toBeVisible();
    }
  });
});
