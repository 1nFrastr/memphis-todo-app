import { test, expect } from '@playwright/test';

test.describe('Test Suite 5: Progress Stats', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('33%')).toBeVisible();
  });

  test.skip('Test 5.1: Progress Bar Updates', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });

    // Complete first todo
    await todoItems.nth(0).locator('button.flex-shrink-0').click();
    await expect(page.getByText('66%')).toBeVisible();

    // Complete third todo
    await todoItems.nth(2).locator('button.flex-shrink-0').click();
    await expect(page.getByText('100%')).toBeVisible();

    // Progress bar visible in stats section
    await expect(page.getByRole('heading', { name: '进度' })).toBeVisible();
  });

  test('Test 5.2: Progress with Empty List', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    for (let i = 0; i < 3; i++) {
      const todo = todoItems.first();
      await todo.hover();
      await todo.locator('button').first().click();
    }

    await expect(page.getByText('0%')).toBeVisible();
    await expect(page.getByText(/0\s*\/\s*0\s*任务完成/)).toBeVisible();
  });

  test('Test 5.3: Progress Calculation Accuracy', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    for (let i = 0; i < 7; i++) {
      await inputField.fill(`New todo ${i}`);
      await addButton.click();
    }

    // Total 10 todos, complete 3 (one was already completed, so complete 2 more)
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await todoItems.nth(0).locator('div.flex.items-center button').click();
    await todoItems.nth(2).locator('div.flex.items-center button').click();

    await expect(page.getByText('30%')).toBeVisible();
    await expect(page.getByText(/3\s*\/\s*10\s*任务完成/)).toBeVisible();
  });
});
