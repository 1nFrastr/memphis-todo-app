import { test, expect } from '@playwright/test';

test.describe('Test Suite 1: Page Load and Initial State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Test 1.1: Verify Initial Page Load', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    // 2. Wait for page to fully load
    await expect(page).toHaveTitle(/webapp-react-template/);

    // - Header displays "MEMPHIS" with sparkles icons
    await expect(page.getByRole('heading', { name: 'MEMPHIS' })).toBeVisible();

    // - Subtitle displays "待办事项清单"
    await expect(page.getByText('待办事项清单')).toBeVisible();

    // - No error messages or console errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    expect(errors).toHaveLength(0);
  });

  test('Test 1.2: Verify Initial Todo Items', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    // 2. Count the number of todo items displayed
    const todoItems = page.locator('div.space-y-4 > div').filter({ has: page.locator('button') });
    await expect(todoItems).toHaveCount(3);

    // - First item: "学习孟菲斯设计风格" with pink background, unchecked
    const firstTodo = todoItems.nth(0);
    await expect(firstTodo.getByText('学习孟菲斯设计风格')).toBeVisible();

    // - Second item: "创建一个酷炫的 Todo App" with teal background, checked (strikethrough)
    const secondTodo = todoItems.nth(1);
    await expect(secondTodo.getByText('创建一个酷炫的 Todo App')).toBeVisible();
    await expect(secondTodo.locator('span.line-through')).toBeVisible();

    // - Third item: "享受设计的乐趣" with yellow background, unchecked
    const thirdTodo = todoItems.nth(2);
    await expect(thirdTodo.getByText('享受设计的乐趣')).toBeVisible();
  });

  test('Test 1.3: Verify Initial Progress Stats', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    // 2. Locate the progress stats section
    // - Progress section displays "进度" heading
    await expect(page.getByRole('heading', { name: '进度' })).toBeVisible();

    // - Percentage shows "33%" (1 of 3 completed)
    await expect(page.getByText('33%')).toBeVisible();

    // - Text shows "1 / 3 任务完成"
    await expect(page.getByText(/1\s*\/\s*3\s*任务完成/)).toBeVisible();
  });

  test('Test 1.4: Verify Input Form Initial State', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    // 2. Locate the todo input form
    const inputField = page.locator('input[type="text"]');

    // - Input field is empty
    await expect(inputField).toHaveValue('');

    // - Input placeholder shows "添加新的任务..."
    await expect(inputField).toHaveAttribute('placeholder', '添加新的任务...');

    // - First color (pink) is selected by default (has ring indicator)
    const colorButtons = page.locator('form button[type="button"]');
    const firstColorBtn = colorButtons.first();
    const hasRing = await firstColorBtn.evaluate((el) =>
      el.classList.contains('ring-4') || el.classList.contains('ring-offset-2')
    );
    expect(hasRing).toBeTruthy();

    // - All 6 color options are visible
    await expect(colorButtons).toHaveCount(6);

    // - Add button is disabled when empty
    const addButton = page.locator('form button[type="submit"]');
    await expect(addButton).toBeDisabled();
  });
});
