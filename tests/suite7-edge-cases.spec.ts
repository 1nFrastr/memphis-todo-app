import { test, expect } from '@playwright/test';

test.describe('Test Suite 7: Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test 7.1: Add Duplicate Todo Text', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    await inputField.fill('Duplicate');
    await addButton.click();
    await inputField.fill('Duplicate');
    await addButton.click();

    const duplicates = page.getByText('Duplicate');
    await expect(duplicates).toHaveCount(2);
  });

  test('Test 7.2: Very Rapid Interactions', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    await inputField.fill('Rapid');
    await addButton.click();
    // After submit, input clears and button becomes disabled - no duplicate possible
    await expect(inputField).toHaveValue('');
    await expect(addButton).toBeDisabled();

    const rapidTodos = page.getByText('Rapid');
    await expect(rapidTodos).toHaveCount(1);
  });

  test('Test 7.3: Special HTML Characters', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');
    const xssText = "<script>alert('xss')</script>";

    await inputField.fill(xssText);
    await addButton.click();

    // Text displayed as literal, not executed
    await expect(page.getByText(xssText)).toBeVisible();
  });

  test('Test 7.4: Maximum Input Length', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');
    const longText = 'A'.repeat(1000);

    await inputField.fill(longText);
    await addButton.click();

    const newTodo = page.locator('div').filter({ hasText: longText }).filter({ has: page.locator('button') }).first();
    await expect(newTodo).toBeVisible();
  });

  test('Test 7.5: Browser Refresh', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    await inputField.fill('Temporary todo');
    await addButton.click();
    await expect(page.getByText('Temporary todo')).toBeVisible();

    await page.reload();
    await expect(page.locator('body')).toBeVisible();

    // New todo NOT persisted
    await expect(page.getByText('Temporary todo')).not.toBeVisible();
    await expect(page.getByText('学习孟菲斯设计风格')).toBeVisible();
  });
});
