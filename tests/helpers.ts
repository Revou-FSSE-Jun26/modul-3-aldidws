import { expect, type Page } from '@playwright/test';

/**
 * Navigate to a path and wait until the page is interactive (hydrated).
 *
 * On WebKit the Next.js dev server can finish hydrating a client component a
 * short moment after its inputs are already visible and actionable. Until
 * hydration runs, typed values live only in the DOM: React has not attached
 * its `onChange` handlers, so nothing reaches component state. When hydration
 * finally runs, React renders the controlled inputs from their initial (empty)
 * state and discards whatever was typed beforehand.
 *
 * Waiting for the network to settle after navigation lets hydration complete
 * before the test interacts, so the first `fill`/`click` lands on a live page.
 * This only changes test timing — no application behaviour is affected.
 */
export async function gotoHydrated(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'networkidle' });
}

/**
 * Fill a text input and confirm the value survives hydration.
 *
 * Re-applies the fill until the value is still present after a short settle,
 * which deterministically waits out a late hydration pass that would otherwise
 * reset a controlled input to its initial state (see {@link gotoHydrated}).
 */
export async function fillStable(
  page: Page,
  selector: string,
  value: string,
): Promise<void> {
  const input = page.locator(selector);
  await expect(async () => {
    await input.fill(value);
    // A late hydration render resets the field a tick after the fill; re-read
    // after a short wait so the retry catches and re-applies it.
    await page.waitForTimeout(150);
    await expect(input).toHaveValue(value);
  }).toPass({ timeout: 10_000 });
}
