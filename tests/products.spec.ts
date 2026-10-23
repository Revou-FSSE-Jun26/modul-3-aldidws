import { test, expect, type Page } from '@playwright/test';

async function searchProducts(page: Page, term: string): Promise<void> {
  await page.goto('/products');
  const input = page.locator('#searchbar');
  const submit = page.locator('#search');
  await expect(input).toBeVisible();

  await expect(async () => {
    await input.fill(term);
    await submit.click();
    await expect(page).toHaveURL(new RegExp(`q=${term}`));
  }).toPass({ timeout: 15_000 });
}

test.describe('Products catalog', () => {
  test('renders the catalog heading and search bar', async ({ page }) => {
    await page.goto('/products');
    await expect(
      page.getByRole('heading', { name: 'Product Catalog' }),
    ).toBeVisible();
    await expect(page.locator('#searchbar')).toBeVisible();
    await expect(page.locator('#search')).toBeVisible();
  });

  test('shows the "All" category chip', async ({ page }) => {
    await page.goto('/products');
    const filterGroup = page.getByRole('group', { name: 'Filter by category' });
    await expect(filterGroup.getByRole('link', { name: 'All' })).toBeVisible();
  });

  test('clicking a category filter updates the URL', async ({ page }) => {
    await page.goto('/products');
    const filterGroup = page.getByRole('group', { name: 'Filter by category' });

    const chips = filterGroup.getByRole('link');
    const count = await chips.count();
    expect(count).toBeGreaterThanOrEqual(1);

    if (count > 1) {
      await chips.nth(1).click();
      await expect(page).toHaveURL(/category=/);
    }
  });

  test('searching narrows the results and updates the URL', async ({
    page,
  }) => {
    await searchProducts(page, 'oil');
    await expect(page).toHaveURL(/q=oil/);
    await expect(page.getByText(/for "oil"/)).toBeVisible();
  });

  test('a search with no matches shows the empty state', async ({ page }) => {
    await searchProducts(page, 'zzzznomatchzzzz');
    await expect(page.getByText('No matching products found.')).toBeVisible();
  });

  test('the Reset button clears an active search', async ({ page }) => {
    await page.goto('/products?q=oil');
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page).toHaveURL(/\/products$/);
  });
});

test.describe('Product detail', () => {
  test('opens a product detail page from the catalog', async ({ page }) => {
    await page.goto('/products');

    const firstProduct = page
      .getByRole('link')
      .filter({ hasNot: page.getByRole('group') })
      .first();

    const productLink = page.locator('a[href^="/products/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    await page.waitForURL('**/products/**');
    await expect(
      page.getByRole('button', { name: /Add to Cart|Out of Stock/ }),
    ).toBeVisible();
  });
});
