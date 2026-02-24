import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // Navigate to the TodoMVC app (dev server)
    await page.goto('http://localhost:5173');

    // Wait for the app to be ready
    await expect(page.locator('body')).toBeVisible();
  });
});
