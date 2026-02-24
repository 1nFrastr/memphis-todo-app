# TodoMVC Basic Operations Test Plan

## Overview

This test plan covers the Memphis-style TodoMVC React application. The app features a vibrant, colorful design inspired by the Memphis design movement, with Chinese text labels and playful animations. It includes an input form with color selection, a progress stats component, and animated todo items with toggle and delete functionality.

**Initial State:** The app loads with 3 pre-populated sample todos:
1. "学习孟菲斯设计风格" (incomplete, pink color #FF6B9D)
2. "创建一个酷炫的 Todo App" (completed, teal color #4ECDC4)
3. "享受设计的乐趣" (incomplete, yellow color #FFE66D)

---

## Test Suite 1: Page Load and Initial State

### Test 1.1: Verify Initial Page Load
**Steps:**
1. Navigate to http://localhost:5173
2. Wait for page to fully load

**Expected Results:**
- Page title contains "webapp-react-template"
- Header displays "MEMPHIS" with sparkles icons
- Subtitle displays "待办事项清单" (Todo List in Chinese)
- Background contains floating decorative elements (circles, squares, dots)
- No error messages or console errors

### Test 1.2: Verify Initial Todo Items
**Steps:**
1. Navigate to http://localhost:5173
2. Count the number of todo items displayed

**Expected Results:**
- Exactly 3 todo items are displayed
- First item: "学习孟菲斯设计风格" with pink background, unchecked checkbox
- Second item: "创建一个酷炫的 Todo App" with teal background, checked checkbox (strikethrough text)
- Third item: "享受设计的乐趣" with yellow background, unchecked checkbox

### Test 1.3: Verify Initial Progress Stats
**Steps:**
1. Navigate to http://localhost:5173
2. Locate the progress stats section

**Expected Results:**
- Progress section displays "进度" (Progress) heading
- Percentage shows "33%" (1 of 3 completed)
- Progress bar is filled to approximately 33%
- Text shows "1 / 3 任务完成" (1/3 tasks completed)

### Test 1.4: Verify Input Form Initial State
**Steps:**
1. Navigate to http://localhost:5173
2. Locate the todo input form

**Expected Results:**
- Input field is empty
- Input placeholder shows "添加新的任务..."
- First color (pink #FF6B9D) is selected by default (has ring indicator)
- All 6 color options are visible
- Add button (Plus icon) is disabled (grayed out)

---

## Test Suite 2: Adding Todos

### Test 2.1: Add Todo with Default Color
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field
3. Type "Buy groceries"
4. Click the add button (Plus icon)

**Expected Results:**
- New todo item appears at the top of the list
- Todo text displays "Buy groceries"
- Todo has pink background (default color)
- Checkbox is unchecked
- Input field is cleared after adding
- Progress stats update to show 1/4 completed (25%)

### Test 2.2: Add Todo with Different Color
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field
3. Type "Walk the dog"
4. Click the teal color button (#4ECDC4)
5. Click the add button

**Expected Results:**
- New todo appears with teal background
- Color selection ring moves to teal button
- Todo is added successfully with selected color

### Test 2.3: Add Todo with Each Available Color
**Steps:**
1. Navigate to http://localhost:5173
2. For each color in [pink, teal, yellow, orange, mint, lavender]:
   - Click input field
   - Type "Test color"
   - Select the color
   - Click add button

**Expected Results:**
- Each todo is added with the correct background color:
  - Pink: #FF6B9D
  - Teal: #4ECDC4
  - Yellow: #FFE66D
  - Orange: #FF9F43
  - Mint: #A8E6CF
  - Lavender: #C7CEEA

### Test 2.4: Add Todo with Empty Input
**Steps:**
1. Navigate to http://localhost:5173
2. Click the add button without typing anything

**Expected Results:**
- No new todo is added
- Todo list remains unchanged
- Add button remains disabled

### Test 2.5: Add Todo with Whitespace Only
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field
3. Type "   " (spaces only)
4. Click the add button

**Expected Results:**
- No new todo is added
- Input field may be cleared or remain with spaces
- Add button should be disabled

### Test 2.6: Add Todo with Special Characters
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field
3. Type "!@#$%^&*()_+{}|:<>?~`-=[]\\;\',./"
4. Click the add button

**Expected Results:**
- Todo is added with all special characters displayed correctly
- No JavaScript errors occur

### Test 2.7: Add Todo with Unicode Characters
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field
3. Type "Hello 世界 🌍 émojis!"
4. Click the add button

**Expected Results:**
- Todo is added with mixed languages and emojis
- Characters display correctly

### Test 2.8: Add Very Long Todo Text
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field
3. Type a string of 200+ characters
4. Click the add button

**Expected Results:**
- Todo is added successfully
- Text wraps correctly within the todo item (break-all class handles overflow)
- Layout does not break

### Test 2.9: Add Multiple Todos Rapidly
**Steps:**
1. Navigate to http://localhost:5173
2. Quickly add 5 todos in succession

**Expected Results:**
- All 5 todos are added to the list
- Each todo has a unique ID
- Todos appear in reverse order (newest first)
- Progress stats update correctly

### Test 2.10: Add Todo Using Enter Key
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field
3. Type "Press enter test"
4. Press Enter key

**Expected Results:**
- Todo is added successfully
- Form submits on Enter key press
- Input field is cleared

---

## Test Suite 3: Completing Todos

### Test 3.1: Complete an Incomplete Todo
**Steps:**
1. Navigate to http://localhost:5173
2. Click the checkbox for the first todo "学习孟菲斯设计风格"

**Expected Results:**
- Checkbox shows checkmark icon
- Checkbox background changes to teal (#4ECDC4)
- Todo text gets strikethrough decoration
- Todo opacity reduces to 60%
- Progress updates to 2/3 completed (66%)

### Test 3.2: Uncomplete a Completed Todo
**Steps:**
1. Navigate to http://localhost:5173
2. Click the checkbox for the second todo "创建一个酷炫的 Todo App" (which is initially completed)

**Expected Results:**
- Checkmark icon is removed
- Checkbox background returns to transparent
- Strikethrough is removed from text
- Opacity returns to 100%
- Progress updates to 0/3 completed (0%)

### Test 3.3: Complete All Todos
**Steps:**
1. Navigate to http://localhost:5173
2. Click checkboxes for all incomplete todos

**Expected Results:**
- All todos show as completed
- Progress shows 100%
- Progress bar is completely filled
- Celebration banner appears with "太棒了！所有任务都完成啦！" (Great! All tasks completed!)
- Banner includes PartyPopper icons
- Banner has bounce animation

### Test 3.4: Uncomplete All Todos
**Steps:**
1. Navigate to http://localhost:5173
2. Complete all todos first
3. Click all checkboxes again to uncomplete

**Expected Results:**
- All todos show as incomplete
- Progress shows 0%
- Celebration banner disappears
- Progress bar is empty

### Test 3.5: Toggle Todo Multiple Times
**Steps:**
1. Navigate to http://localhost:5173
2. Click the same checkbox 5 times rapidly

**Expected Results:**
- Todo toggles between completed and incomplete states
- Final state depends on number of clicks (odd = completed, even = incomplete)
- No errors or race conditions occur

---

## Test Suite 4: Deleting Todos

### Test 4.1: Delete a Todo
**Steps:**
1. Navigate to http://localhost:5173
2. Hover over the first todo
3. Click the delete button (trash icon) that appears

**Expected Results:**
- Todo is removed from the list
- Remaining todos shift up
- Progress stats update (now 1/2 completed = 50%)

### Test 4.2: Delete All Todos
**Steps:**
1. Navigate to http://localhost:5173
2. Delete each of the 3 todos one by one

**Expected Results:**
- All todos are removed
- Empty state message appears: "还没有任务" (No tasks yet)
- Subtitle shows: "添加你的第一个待办事项吧！" (Add your first todo!)
- ListTodo icon is displayed in the center
- Progress shows 0/0 (0%)

### Test 4.3: Delete Completed Todo
**Steps:**
1. Navigate to http://localhost:5173
2. Hover over the completed todo "创建一个酷炫的 Todo App"
3. Click the delete button

**Expected Results:**
- Todo is removed
- Progress updates to 0/2 completed (0%)

### Test 4.4: Delete Todo and Add New One
**Steps:**
1. Navigate to http://localhost:5173
2. Delete the first todo
3. Add a new todo "Replacement task"

**Expected Results:**
- Deleted todo is gone
- New todo appears at the top
- Progress reflects correct count

---

## Test Suite 5: Progress Stats

### Test 5.1: Progress Bar Updates
**Steps:**
1. Navigate to http://localhost:5173
2. Note initial progress (33%)
3. Complete one todo
4. Note progress (66%)
5. Complete another todo
6. Note progress (100%)

**Expected Results:**
- Progress bar width updates smoothly with transition animation
- Percentage text updates correctly
- Gradient from pink to teal is visible in the progress bar

### Test 5.2: Progress with Empty List
**Steps:**
1. Navigate to http://localhost:5173
2. Delete all todos

**Expected Results:**
- Progress shows 0%
- Progress bar is empty (0 width)
- Text shows "0 / 0 任务完成"
- No division by zero errors

### Test 5.3: Progress Calculation Accuracy
**Steps:**
1. Navigate to http://localhost:5173
2. Add 7 new todos (total 10)
3. Complete 3 todos

**Expected Results:**
- Progress shows exactly 30% (3/10)
- Math.round is used for percentage calculation

---

## Test Suite 6: UI Interactions and Visual States

### Test 6.1: Color Selection Visual Feedback
**Steps:**
1. Navigate to http://localhost:5173
2. Click each color button

**Expected Results:**
- Selected color has ring-4 ring-offset-2 ring-[#2D3436] classes applied
- Ring is clearly visible around selected color
- Previous selection loses the ring

### Test 6.2: Todo Hover Effects
**Steps:**
1. Navigate to http://localhost:5173
2. Hover over any todo item

**Expected Results:**
- Delete button appears in top-right corner
- Todo lifts slightly (translate-x-[-2px] translate-y-[-2px])
- Shadow increases (memphis-shadow-hover)
- Transition is smooth (300ms duration)

### Test 6.3: Button Hover States
**Steps:**
1. Navigate to http://localhost:5173
2. Hover over the add button (with text entered)
3. Hover over color buttons

**Expected Results:**
- Add button: lifts and shadow increases
- Color buttons: ring appears on selected, others show hover feedback

### Test 6.4: Input Focus State
**Steps:**
1. Navigate to http://localhost:5173
2. Click on the input field

**Expected Results:**
- Input field has outline-none (no browser default outline)
- Field appears focused via shadow or border changes
- Cursor is visible in the field

---

## Test Suite 7: Edge Cases

### Test 7.1: Add Duplicate Todo Text
**Steps:**
1. Navigate to http://localhost:5173
2. Add todo "Duplicate"
3. Add another todo "Duplicate"

**Expected Results:**
- Both todos are added (duplicates are allowed)
- Each has a unique ID
- Both appear in the list

### Test 7.2: Very Rapid Interactions
**Steps:**
1. Navigate to http://localhost:5173
2. Rapidly click add button multiple times while typing

**Expected Results:**
- App handles rapid interactions gracefully
- No duplicate submissions if button is disabled
- State remains consistent

### Test 7.3: Special HTML Characters
**Steps:**
1. Navigate to http://localhost:5173
2. Add todo with text "<script>alert('xss')</script>"

**Expected Results:**
- Text is displayed as literal string, not executed
- No XSS vulnerability (React escapes content by default)

### Test 7.4: Maximum Input Length
**Steps:**
1. Navigate to http://localhost:5173
2. Attempt to paste extremely long text (1000+ characters)

**Expected Results:**
- Text is accepted (no maxLength on input)
- Todo is added
- Layout handles overflow with break-all class

### Test 7.5: Browser Refresh
**Steps:**
1. Navigate to http://localhost:5173
2. Add a new todo
3. Refresh the page

**Expected Results:**
- Page reloads with initial 3 todos
- New todo is NOT persisted (no localStorage)
- App returns to default state

---

## Test Suite 8: Accessibility

### Test 8.1: Keyboard Navigation
**Steps:**
1. Navigate to http://localhost:5173
2. Press Tab to navigate through interactive elements

**Expected Results:**
- Input field is focusable
- Color buttons are focusable
- Add button is focusable (when enabled)
- Todo checkboxes are focusable
- Delete buttons are focusable (when visible)

### Test 8.2: Button Disabled State
**Steps:**
1. Navigate to http://localhost:5173
2. Verify add button is disabled when input is empty
3. Type text and verify button becomes enabled

**Expected Results:**
- Button has disabled attribute when input is empty
- Button opacity is 50% when disabled
- Cursor shows not-allowed when disabled
- Button becomes fully opaque when enabled

---

## Summary of Interactive Elements

| Element | Selector/Location | Interaction |
|---------|------------------|-------------|
| Input Field | `input[type="text"]` | Type text, placeholder "添加新的任务..." |
| Color Buttons | 6 colored buttons | Click to select color |
| Add Button | Button with Plus icon | Click to add todo (disabled when empty) |
| Todo Checkboxes | Square buttons in todo items | Click to toggle completion |
| Delete Buttons | Trash icon (appears on hover) | Click to delete todo |
| Progress Bar | Gradient bar in stats section | Visual indicator only |

## Color Palette Reference

| Name | Hex Code | Tailwind Class |
|------|----------|----------------|
| Pink | #FF6B9D | bg-[#FF6B9D] |
| Teal | #4ECDC4 | bg-[#4ECDC4] |
| Yellow | #FFE66D | bg-[#FFE66D] |
| Orange | #FF9F43 | bg-[#FF9F43] |
| Mint | #A8E6CF | bg-[#A8E6CF] |
| Lavender | #C7CEEA | bg-[#C7CEEA] |
