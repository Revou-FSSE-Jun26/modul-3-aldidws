import { test, expect } from '@playwright/test';

// Test that each product category filter on the products page can be clicked.
test('click categories', async ({ page }) => {

    // Open the products listing page served by the local dev server.
    await page.goto('http://localhost:3000/products');

    // Click through every category filter one by one to verify each is clickable.
    await page.getByText('All').click();                       // Show all products (no filter)
    await page.getByText('Brake System').click();              // Brake System category
    await page.getByText('Engine & Maintenance').click();      // Engine & Maintenance category
    await page.getByText('Exhaust System').click();          // Exhaust System category
    await page.getByText('Exterior & Body Kit').click();       // Exterior & Body Kit category
    await page.getByText('Interior & Accessories').click();    // Interior & Accessories category
    await page.getByText('Lighting & Electrical').click();     // Lighting & Electrical category
    await page.getByText('Suspensi & Handling').click();       // Suspension & Handling category
    await page.getByText('Velg & Ban').click();                // Wheels & Tires category
  
});

test('click search product and add to cart', async ({ page }) => {

    await page.goto('http://localhost:3000/products');
    await page.locator('#searchbar').fill('oil filter');
    await page.locator('#search').click();
    await page.getByRole('link', { name: 'Oil Filter BMW 3 Series F30' }).click();
    await page.waitForURL('**/products/**');
    await page.getByRole('button', { name: /Add to Cart/ }).click();

});

// test('login', async ({ page }) => {
//   await page.goto('http://localhost:3000/auth/login');
//   await page.fill('#email', 'budi@example.com');
//   await page.fill('#password', 'Rahasia123!');
//   await page.click('button[type="login"]');
//   await expect(page).toHaveURL('http://localhost:3000');
//   await expect(page.locator('h1')).toContainText('Welcome');
// });
