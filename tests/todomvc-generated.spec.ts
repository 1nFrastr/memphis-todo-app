import { test, expect } from '@playwright/test';

test.describe('Test Suite 2: Adding Todos', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the TodoMVC app before each test
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test 2.1: Add Todo with Default Color', async ({ page }) => {
    // Step 1: Click on the input field
    const inputField = page.locator('input[type="text"]');
    await inputField.click();

    // Step 2: Type "Buy groceries"
    await inputField.fill('Buy groceries');

    // Step 3: Click the add button (Plus icon) - submit button with type="submit"
    const addButton = page.locator('form button[type="submit"]');
    await addButton.click();

    // Expected Results:
    // - New todo item appears at the top of the list
    // Target the todo item card (direct child of list container) so backgroundColor is on that element
    const newTodo = page.locator('div.space-y-4 > div').filter({ hasText: 'Buy groceries' });
    await expect(newTodo).toBeVisible();

    // - Todo text displays "Buy groceries"
    await expect(page.getByText('Buy groceries')).toBeVisible();

    // - Todo has pink background (default #FF6B9D) — 选中颜色会反映到列表
    const backgroundColor = await newTodo.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(backgroundColor).toBe('rgb(255, 107, 157)'); // #FF6B9D

    // - Checkbox is unchecked (no Check icon visible)
    const checkIcon = newTodo.locator('svg').filter({ has: page.locator('path[d*="Check"]') });
    const hasCheckIcon = await checkIcon.count() > 0;
    expect(hasCheckIcon).toBeFalsy();

    // - Input field is cleared after adding
    await expect(inputField).toHaveValue('');

    // - Progress stats update to show 1/4 completed (25%)
    // Check for "1 / 4 任务完成" text
    const progressText = page.getByText(/1\s*\/\s*4\s*任务完成/);
    await expect(progressText).toBeVisible();
    const percentageText = page.locator('text=25%');
    await expect(percentageText).toBeVisible();
  });

  test('Test 2.2: Add Todo with Different Color', async ({ page }) => {
    // Step 1: Click on the input field
    const inputField = page.locator('input[type="text"]');
    await inputField.click();

    // Step 2: Type "Walk the dog"
    await inputField.fill('Walk the dog');

    // Step 3: Click the teal color button (#4ECDC4)
    // The color buttons are in the form, find by index (second button is teal)
    const colorButtons = page.locator('form button[type="button"]');
    const tealColorButton = colorButtons.nth(1); // Second color button (index 1)
    await tealColorButton.click();

    // Step 4: Click the add button
    const addButton = page.locator('form button[type="submit"]');
    await addButton.click();

    // Expected Results:
    // - New todo appears with teal background (#4ECDC4)
    const newTodo = page.locator('div.space-y-4 > div').filter({ hasText: 'Walk the dog' });
    await expect(newTodo).toBeVisible();
    const bgColor = await newTodo.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe('rgb(78, 205, 196)'); // #4ECDC4

    // - Color selection ring moves to teal button
    const hasRing = await tealColorButton.evaluate((el) => {
      return el.classList.contains('ring-4') || el.classList.contains('ring-offset-2');
    });
    expect(hasRing).toBeTruthy();
  });

  test('Test 2.3: Add Todo with Each Available Color', async ({ page }) => {
    const labels = ['Test pink', 'Test teal', 'Test yellow', 'Test orange', 'Test mint', 'Test lavender'];
    const colorButtons = page.locator('form button[type="button"]');
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    for (let i = 0; i < 6; i++) {
      await inputField.click();
      await inputField.fill(labels[i]);
      await colorButtons.nth(i).click();
      await addButton.click();

      const newTodo = page.locator('div.space-y-4 > div').filter({ hasText: labels[i] });
      await expect(newTodo).toBeVisible();
      const bgColor = await newTodo.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      const expectedRgbs = ['rgb(255, 107, 157)', 'rgb(78, 205, 196)', 'rgb(255, 230, 109)', 'rgb(255, 159, 67)', 'rgb(168, 230, 207)', 'rgb(199, 206, 234)'];
      expect(bgColor).toBe(expectedRgbs[i]);
    }
  });

  test('Test 2.4: Add Todo with Empty Input', async ({ page }) => {
    // 1. Click the add button without typing - button should be disabled
    const addButton = page.locator('form button[type="submit"]');

    // Expected Results:
    // - Add button should be disabled when input is empty
    await expect(addButton).toBeDisabled();

    // Verify button has disabled styling (opacity-50)
    const opacity = await addButton.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(opacity)).toBeLessThan(1);

    // - No new todo is added - count initial todos (3 pre-populated)
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    const initialTodoCount = await todoItems.count();
    expect(initialTodoCount).toBe(3);

    // Try to click anyway (should not work due to disabled state)
    // Playwright will fail to click a disabled button, so we verify it's disabled
    const isDisabled = await addButton.isDisabled();
    expect(isDisabled).toBeTruthy();

    // - Todo list remains unchanged - still 3 todos
    const finalTodoCount = await todoItems.count();
    expect(finalTodoCount).toBe(3);
  });

  test('Test 2.5: Add Todo with Whitespace Only', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    await inputField.click();
    await inputField.fill('   ');
    // Add button should be disabled (trimmed empty)
    await expect(addButton).toBeDisabled();

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    expect(await todoItems.count()).toBe(3);
  });

  test('Test 2.6: Add Todo with Special Characters', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');
    const specialText = '!@#$%^&*()_+{}|:<>?~`-=[]\\;\',./';

    await inputField.click();
    await inputField.fill(specialText);
    await addButton.click();

    await expect(page.getByText(specialText)).toBeVisible();
  });

  test('Test 2.7: Add Todo with Unicode Characters', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');
    const unicodeText = 'Hello 世界 🌍 émojis!';

    await inputField.click();
    await inputField.fill(unicodeText);
    await addButton.click();

    await expect(page.getByText(unicodeText)).toBeVisible();
  });

  test('Test 2.8: Add Very Long Todo Text', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');
    const longText = 'A'.repeat(200);

    await inputField.click();
    await inputField.fill(longText);
    await addButton.click();

    const newTodo = page.locator('div').filter({ hasText: longText }).filter({ has: page.locator('button') }).first();
    await expect(newTodo).toBeVisible();
  });

  test('Test 2.9: Add Multiple Todos Rapidly', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');
    const labels = ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4', 'Todo 5'];

    for (const label of labels) {
      await inputField.fill(label);
      await addButton.click();
    }

    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems).toHaveCount(8); // 3 initial + 5 new
    for (const label of labels) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('Test 2.10: Add Todo Using Enter Key', async ({ page }) => {
    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');

    await inputField.click();
    await inputField.fill('Press enter test');
    await inputField.press('Enter');

    await expect(page.getByText('Press enter test')).toBeVisible();
    await expect(inputField).toHaveValue('');
  });
});
