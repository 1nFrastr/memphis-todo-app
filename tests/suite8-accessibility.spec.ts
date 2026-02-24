import { test, expect } from '@playwright/test';

test.describe('Test Suite 8: Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test 8.1: Keyboard Navigation', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');

    // Input field is focusable
    await page.keyboard.press('Tab');
    await expect(inputField).toBeFocused();

    // Tab moves to color buttons and add button - verify elements are reachable
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT']).toContain(focusedTag);
  });

  test('Test 8.2: Button Disabled State', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    // Button disabled when empty
    await expect(addButton).toBeDisabled();
    const opacityDisabled = await addButton.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacityDisabled)).toBeLessThan(1);

    // Type text - button becomes enabled
    await inputField.fill('Enable me');
    await expect(addButton).toBeEnabled();
  });
});
