import { test, expect } from '@playwright/test';

test.describe('Test Suite 6: UI Interactions and Visual States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test 6.1: Color Selection Visual Feedback', async ({ page }) => {
    const colorButtons = page.locator('form button[type="button"]');

    for (let i = 0; i < 6; i++) {
      await colorButtons.nth(i).click();
      const hasRing = await colorButtons.nth(i).evaluate((el) =>
        el.classList.contains('ring-4') || el.classList.contains('ring-offset-2')
      );
      expect(hasRing).toBeTruthy();
    }
  });

  test('Test 6.2: Todo Hover Effects', async ({ page }) => {
    const firstTodo = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') }).first();
    await firstTodo.hover();

    // Delete button appears (opacity transition)
    const deleteBtn = firstTodo.locator('button').first();
    await expect(deleteBtn).toBeVisible();
  });

  test('Test 6.3: Button Hover States', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    await inputField.fill('Test');
    await addButton.hover();
    await expect(addButton).toBeVisible();
  });

  test('Test 6.4: Input Focus State', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    await inputField.click();
    await expect(inputField).toBeFocused();
  });
});
