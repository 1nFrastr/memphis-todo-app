import { test, expect } from '@playwright/test';

test.describe('Test Suite 4: Deleting Todos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test 4.1: Delete a Todo', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    const firstTodo = todoItems.nth(0);

    await firstTodo.hover();
    const deleteBtn = firstTodo.locator('button').first();
    await deleteBtn.click();

    // - Todo removed, progress updates to 1/2 (50%)
    await expect(page.getByText('学习孟菲斯设计风格')).not.toBeVisible();
    await expect(page.getByText('50%')).toBeVisible();
    await expect(page.getByText(/1\s*\/\s*2\s*任务完成/)).toBeVisible();
  });

  test('Test 4.2: Delete All Todos', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });

    for (let i = 0; i < 3; i++) {
      const todo = todoItems.first();
      await todo.hover();
      await todo.locator('button').first().click();
    }

    // - Empty state message
    await expect(page.getByText('还没有任务')).toBeVisible();
    await expect(page.getByText('添加你的第一个待办事项吧！')).toBeVisible();
    await expect(page.getByText('0%')).toBeVisible();
    await expect(page.getByText(/0\s*\/\s*0\s*任务完成/)).toBeVisible();
  });

  test('Test 4.3: Delete Completed Todo', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    const completedTodo = todoItems.nth(1); // "创建一个酷炫的 Todo App"

    await completedTodo.hover();
    await completedTodo.locator('button').first().click();

    await expect(page.getByText('创建一个酷炫的 Todo App')).not.toBeVisible();
    await expect(page.getByText(/0\s*\/\s*2\s*任务完成/)).toBeVisible();
  });

  test('Test 4.4: Delete Todo and Add New One', async ({ page }) => {
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await todoItems.nth(0).hover();
    await todoItems.nth(0).locator('button').first().click();

    const inputField = page.locator('input[type="text"]');
    const addButton = page.locator('form button[type="submit"]');
    await inputField.fill('Replacement task');
    await addButton.click();

    await expect(page.getByText('学习孟菲斯设计风格')).not.toBeVisible();
    await expect(page.getByText('Replacement task')).toBeVisible();
  });
});
