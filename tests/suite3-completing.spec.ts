import { test, expect } from '@playwright/test';

test.describe('Test Suite 3: Completing Todos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('33%')).toBeVisible();
  });

  test('Test 3.1: Complete an Incomplete Todo', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    const firstTodo = todoItems.nth(0);
    await expect(firstTodo.getByText('学习孟菲斯设计风格')).toBeVisible();

    // Click the checkbox (flex-shrink-0 uniquely identifies it vs delete button)
    await firstTodo.locator('button.flex-shrink-0').click();

    // - Checkbox shows checkmark, strikethrough
    await expect(firstTodo.locator('span.line-through')).toBeVisible();

    // - Progress updates to 2/3 (67% — Math.round(2/3*100))
    await expect(page.getByText('67%')).toBeVisible();
    await expect(page.getByText(/2\s*\/\s*3\s*任务完成/)).toBeVisible();
  });

  test('Test 3.2: Uncomplete a Completed Todo', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    const secondTodo = todoItems.nth(1); // "创建一个酷炫的 Todo App" - initially completed
    await expect(secondTodo.getByText('创建一个酷炫的 Todo App')).toBeVisible();

    const checkbox = secondTodo.locator('div.flex.items-center button');
    await checkbox.click();

    // - Strikethrough removed, opacity 100%
    await expect(secondTodo.locator('span.line-through')).not.toBeVisible();

    // - Progress updates to 0/3 (0%)
    await expect(page.getByText('0%')).toBeVisible();
    await expect(page.getByText(/0\s*\/\s*3\s*任务完成/)).toBeVisible();
  });

  test('Test 3.3: Complete All Todos', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    // Complete first (index 0) and third (index 2) - second is already completed
    await todoItems.nth(0).locator('div.flex.items-center button').click();
    await todoItems.nth(2).locator('div.flex.items-center button').click();

    // - Progress shows 100%
    await expect(page.getByText('100%')).toBeVisible();

    // - Celebration banner appears
    await expect(page.getByText('太棒了！所有任务都完成啦！')).toBeVisible();
  });

  test('Test 3.4: Uncomplete All Todos', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    // Complete all (click 0 and 2; item 1 is already complete)
    await todoItems.nth(0).locator('div.flex.items-center button').click();
    await todoItems.nth(2).locator('div.flex.items-center button').click();
    await expect(page.getByText('太棒了！所有任务都完成啦！')).toBeVisible();

    // Then uncomplete all
    for (let i = 0; i < 3; i++) {
      await todoItems.nth(i).locator('div.flex.items-center button').click();
    }

    // - Progress shows 0%, banner disappears
    await expect(page.getByText('0%')).toBeVisible();
    await expect(page.getByText('太棒了！所有任务都完成啦！')).not.toBeVisible();
  });

  test('Test 3.5: Toggle Todo Multiple Times', async ({ page }) => {
    const firstTodo = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') }).nth(0);
    const checkbox = firstTodo.locator('div.flex.items-center button');

    for (let i = 0; i < 5; i++) {
      await checkbox.click();
    }

    // 5 clicks from incomplete: final state = completed
    await expect(firstTodo.locator('span.line-through')).toBeVisible();
  });
});
