import { test, expect } from '@playwright/test';

test.describe('Test Suite 2: Adding Todos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test 2.1: add todo with default color', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Buy groceries');
    await page.locator('form button[type="submit"]').click();

    // New todo appears at top of list
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems.first().getByText('Buy groceries')).toBeVisible();

    // Input is cleared
    await expect(input).toHaveValue('');

    // Stats update — now 4 items, 1 complete → 25%
    await expect(page.getByText('25%')).toBeVisible();
  });

  test('Test 2.2: add todo with teal color', async ({ page }) => {
    // Select teal (second color button)
    const colorButtons = page.locator('form button[type="button"]');
    await colorButtons.nth(1).click();

    // Verify teal is selected (ring-4 on second button)
    const secondBtn = colorButtons.nth(1);
    const hasRing = await secondBtn.evaluate((el) => el.classList.contains('ring-4'));
    expect(hasRing).toBeTruthy();

    await page.locator('input[type="text"]').fill('Walk the dog');
    await page.locator('form button[type="submit"]').click();

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems.first().getByText('Walk the dog')).toBeVisible();
  });

  test('Test 2.3: add todo using Enter key', async ({ page }) => {
    await page.locator('input[type="text"]').fill('Press enter test');
    await page.locator('input[type="text"]').press('Enter');

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems.first().getByText('Press enter test')).toBeVisible();
  });

  test('Test 2.4: empty add does nothing — button is disabled', async ({ page }) => {
    const addButton = page.locator('form button[type="submit"]');
    await expect(addButton).toBeDisabled();

    // Count stays at 3
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems).toHaveCount(3);
  });

  test('Test 2.5: whitespace-only input does not add', async ({ page }) => {
    await page.locator('input[type="text"]').fill('   ');
    const addButton = page.locator('form button[type="submit"]');
    await expect(addButton).toBeDisabled();

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems).toHaveCount(3);
  });

  test('Test 2.6: special characters in text', async ({ page }) => {
    const special = '!@#$%^&*()';
    await page.locator('input[type="text"]').fill(special);
    await page.locator('form button[type="submit"]').click();

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems.first().getByText(special)).toBeVisible();
  });

  test('Test 2.7: unicode and emoji', async ({ page }) => {
    const text = 'Hello 世界 🌍';
    await page.locator('input[type="text"]').fill(text);
    await page.locator('form button[type="submit"]').click();

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems.first().getByText(text)).toBeVisible();
  });

  test('Test 2.8: very long text (200+ chars)', async ({ page }) => {
    const longText = 'A'.repeat(210);
    await page.locator('input[type="text"]').fill(longText);
    await page.locator('form button[type="submit"]').click();

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems.first()).toBeVisible();
    await expect(todoItems).toHaveCount(4);
  });

  test('Test 2.9: multiple rapid additions', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    const submit = page.locator('form button[type="submit"]');

    for (let i = 1; i <= 5; i++) {
      await input.fill(`Rapid task ${i}`);
      await submit.click();
    }

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems).toHaveCount(8); // 3 original + 5 new

    // Newest first
    await expect(todoItems.first().getByText('Rapid task 5')).toBeVisible();
  });

  test('Test 2.10: browser refresh clears new todos — only original 3 remain', async ({ page }) => {
    await page.locator('input[type="text"]').fill('Temporary todo');
    await page.locator('form button[type="submit"]').click();

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems).toHaveCount(4);

    await page.reload();
    await expect(page.locator('body')).toBeVisible();

    const itemsAfterReload = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(itemsAfterReload).toHaveCount(3);
    await expect(page.getByText('Temporary todo')).not.toBeVisible();
  });
});
