# Test Plan: Memphis Todo App

## Scope
- Path(s): `src/lib/utils.ts`, `src/components/todo/TodoComponents.tsx`, `src/App.tsx`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx`
- Framework: Vitest (unit/component) + Playwright (E2E)
- App: Vite + React 19 SPA (no backend, no API, no DB)

## Classification

| File/Module | Type | Reason |
|-------------|------|--------|
| `src/lib/utils.ts` | Unit | Pure function (`cn`), no I/O or side effects |
| `src/components/todo/TodoComponents.tsx` (`colorClassToHex`) | Unit | Pure helper function extracted inline, no I/O |
| `src/components/todo/TodoComponents.tsx` (`TodoStats`) | Unit | Pure display component; output depends only on props |
| `src/components/todo/TodoComponents.tsx` (`TodoInput`) | Component | Stateful form component; DOM interactions, controlled state |
| `src/components/todo/TodoComponents.tsx` (`TodoItem`) | Component | Renders todo; fires callbacks on click |
| `src/components/ui/button.tsx` | Unit | Variant class generation via `cva`; pure render |
| `src/App.tsx` | Component | Root state orchestrator; wires all sub-components together |
| `tests/suite*.spec.ts` | E2E (Playwright) | Full browser tests; already implemented |

> **No Integration or API tests apply.** The app is a pure client-side React SPA with no server, database, or HTTP calls.

---

## Test Cases

### Unit: cn utility

**Source:** `src/lib/utils.ts`
**Test file:** `tests/unit/lib/utils.test.ts`

- **Describe**: `cn()`
- **Cases**:
  - returns single class string unchanged — input: `"foo"`, expected: `"foo"`
  - merges multiple class strings — input: `"foo", "bar"`, expected: `"foo bar"`
  - deduplicates conflicting Tailwind utilities (tailwind-merge) — input: `"p-4", "p-2"`, expected: `"p-2"`
  - ignores falsy values — input: `"foo", false, null, undefined, 0`, expected: `"foo"`
  - handles empty call — input: `()`, expected: `""`
  - handles conditional with object syntax — input: `{ foo: true, bar: false }`, expected: `"foo"`
  - handles array input — input: `["a", "b"]`, expected: `"a b"`
  - merges background color conflicts — input: `"bg-red-500", "bg-blue-500"`, expected: `"bg-blue-500"`
- **Dependencies to mock**: none (pure function)

---

### Unit: colorClassToHex (internal helper)

**Source:** `src/components/todo/TodoComponents.tsx` (internal, not exported — test via re-export or extract)
**Test file:** `tests/unit/components/todo/colorClassToHex.test.ts`

> Note: `colorClassToHex` is not exported. The test-generator should extract it into a separate `src/lib/colorUtils.ts` file (or test it indirectly via `TodoItem` snapshot), OR the function should be exported for testability. Recommend extraction.

- **Describe**: `colorClassToHex()`
- **Cases**:
  - extracts valid 6-digit hex from Tailwind bg class — input: `"bg-[#FF6B9D]"`, expected: `"#FF6B9D"`
  - extracts lowercase hex — input: `"bg-[#4ecdc4]"`, expected: `"#4ecdc4"`
  - returns fallback `#FF6B9D` for non-matching string — input: `"bg-red-500"`, expected: `"#FF6B9D"`
  - returns fallback for empty string — input: `""`, expected: `"#FF6B9D"`
  - handles all 6 COLORS constants correctly — inputs: all 6 `COLORS` entries, expected: their respective hex values
- **Dependencies to mock**: none (pure function)

---

### Unit: TodoStats component

**Source:** `src/components/todo/TodoComponents.tsx`
**Test file:** `tests/unit/components/todo/TodoStats.test.tsx`

- **Describe**: `TodoStats` — percentage calculation and rendering
- **Cases**:
  - renders 0% when no todos exist — props: `{ total: 0, completed: 0 }`, expected: text `"0%"`, text `"0 / 0 任务完成"`
  - renders 33% for 1 of 3 completed — props: `{ total: 3, completed: 1 }`, expected: text `"33%"`, text `"1 / 3 任务完成"`
  - renders 100% when all complete — props: `{ total: 5, completed: 5 }`, expected: text `"100%"`, text `"5 / 5 任务完成"`
  - rounds down at 66% (not 67%) — props: `{ total: 3, completed: 2 }`, expected: text `"66%"` (Math.round(2/3*100) = 67 — verify rounding)
  - progress bar width style equals percentage — props: `{ total: 4, completed: 2 }`, expected: progress div style `width: "50%"`
  - shows "进度" heading — props: any valid, expected: element with text `"进度"` present
- **Dependencies to mock**: none

---

### Unit: Button component (shadcn/ui)

**Source:** `src/components/ui/button.tsx`
**Test file:** `tests/unit/components/ui/button.test.tsx`

- **Describe**: `buttonVariants` class generation
- **Cases**:
  - default variant produces correct base classes — input: `buttonVariants()`, expected: includes `"bg-primary"`, `"text-primary-foreground"`
  - destructive variant — input: `buttonVariants({ variant: "destructive" })`, expected: includes `"bg-destructive"`
  - outline variant — input: `buttonVariants({ variant: "outline" })`, expected: includes `"border"`, `"bg-background"`
  - ghost variant — input: `buttonVariants({ variant: "ghost" })`, expected: does NOT include `"bg-primary"`
  - sm size — input: `buttonVariants({ size: "sm" })`, expected: includes `"h-8"`, `"px-3"`, `"text-xs"`
  - lg size — input: `buttonVariants({ size: "lg" })`, expected: includes `"h-10"`, `"px-8"`
  - icon size — input: `buttonVariants({ size: "icon" })`, expected: includes `"h-9 w-9"`
  - custom className merges correctly — input: `buttonVariants({ className: "mt-4" })`, expected: includes `"mt-4"`

- **Describe**: `Button` render
- **Cases**:
  - renders as `<button>` element — expected: tag is `button`
  - passes `disabled` prop — input: `<Button disabled />`, expected: button element has `disabled` attribute
  - forwards ref correctly — expected: ref object points to button DOM node
  - applies additional className via merge — input: `<Button className="text-xl" />`, expected: rendered class includes `"text-xl"`
- **Dependencies to mock**: none

---

### Component: TodoInput

**Source:** `src/components/todo/TodoComponents.tsx`
**Test file:** `tests/unit/components/todo/TodoInput.test.tsx`

- **Describe**: `TodoInput` — form behavior and controlled state
- **Cases**:
  - renders input field with placeholder `"添加新的任务..."` — expected: input element with correct placeholder
  - renders 6 color selector buttons — expected: 6 `type="button"` elements with color classes
  - first color (`bg-[#FF6B9D]`) is selected by default — expected: first color button has `ring-4` class
  - submit button is disabled when input is empty — expected: submit button has `disabled` attribute
  - submit button is enabled when input has non-whitespace text — action: type `"Hello"`, expected: button is not disabled
  - submit button remains disabled for whitespace-only input — action: type `"   "`, expected: button is disabled
  - calls `onAdd` with trimmed text and selected color on submit — action: type `" Buy milk "`, submit; expected: `onAdd` called with `("Buy milk", "bg-[#FF6B9D]")`
  - clears input after successful submit — action: type `"test"`, submit; expected: input value is `""`
  - does not call `onAdd` on submit with empty input — action: submit empty form; expected: `onAdd` not called
  - selecting a different color updates selection ring — action: click second color button; expected: second button has `ring-4`, first does not
  - calls `onAdd` with the selected color — action: select teal, type `"Task"`, submit; expected: `onAdd` called with `("Task", "bg-[#4ECDC4]")`
  - pressing Enter submits the form — action: type `"Enter test"`, press `{Enter}`; expected: `onAdd` called
- **Dependencies to mock**: `onAdd` callback (vi.fn())

---

### Component: TodoItem

**Source:** `src/components/todo/TodoComponents.tsx`
**Test file:** `tests/unit/components/todo/TodoItem.test.tsx`

- **Describe**: `TodoItem` — display and interaction
- **Cases**:
  - renders todo text — props: `{ todo: { id:1, text:"Buy milk", completed:false, color:"bg-[#4ECDC4]" } }`, expected: text `"Buy milk"` visible
  - incomplete todo has no line-through class on text — expected: span does not have `line-through` class
  - completed todo renders with `line-through` class — props: `completed: true`, expected: span has `line-through` class
  - completed todo renders with reduced opacity — props: `completed: true`, expected: container has `opacity-60` class
  - incomplete todo does not have `opacity-60` — props: `completed: false`, expected: no `opacity-60` class
  - completed checkbox shows `<Check>` icon — props: `completed: true`, expected: Check icon is rendered
  - incomplete checkbox does not show `<Check>` icon — props: `completed: false`, expected: Check icon absent
  - background color is applied via inline style from color class — props: `color: "bg-[#FF6B9D]"`, expected: container style `backgroundColor: "#FF6B9D"`
  - clicking toggle button calls `onToggle` with correct id — action: click toggle button; expected: `onToggle(1)` called
  - clicking delete button calls `onDelete` with correct id — action: click delete button; expected: `onDelete(1)` called
  - `onToggle` is called once per click, not multiple times — action: single click; expected: `onToggle` called exactly once
- **Dependencies to mock**: `onToggle`, `onDelete` callbacks (vi.fn())

---

### Component: App (integration of state + sub-components)

**Source:** `src/App.tsx`
**Test file:** `tests/unit/App.test.tsx`

- **Describe**: `App` — state management and rendering
- **Cases**:
  - renders 3 initial todo items on mount — expected: 3 `TodoItem` renders (or 3 todo texts visible)
  - renders progress showing 33% initially (1 of 3 complete) — expected: `"33%"` text visible
  - `addTodo` adds new item to top of list — action: simulate `TodoInput` submitting `"New task"`; expected: `"New task"` appears first
  - `toggleTodo` marks incomplete todo as completed — action: click toggle on first todo; expected: first todo text has strikethrough
  - `toggleTodo` marks completed todo as incomplete — action: click toggle on second todo (initially complete); expected: strikethrough removed
  - `deleteTodo` removes todo from list — action: click delete on first todo; expected: list has 2 items
  - deleting all todos shows empty state message `"还没有任务"` — action: delete all 3 todos; expected: empty state text visible
  - completing all todos shows celebration banner `"太棒了！所有任务都完成啦！"` — action: complete all; expected: banner visible
  - celebration banner hidden when not all complete — expected: banner absent in initial state
  - `isAllCompleted` is false with empty list — action: delete all todos; expected: celebration banner NOT visible (requires `todos.length > 0`)
  - progress percentage updates after toggle — action: complete first todo; expected: `"66%"` visible
  - each new todo gets unique ID (uses `Date.now()`) — action: add 2 todos; expected: each has different `id`
- **Dependencies to mock**: none (render full component tree); optionally mock `Date.now` for predictable IDs

---

## E2E Tests (Playwright — already implemented)

**Config:** `playwright.config.ts` → `testDir: ./tests`, `baseURL: http://localhost:5173`
**Test files:** `tests/suite1-*.spec.ts` through `tests/suite8-*.spec.ts`

The following suites exist and should be maintained/extended:

| Suite | File | Status |
|-------|------|--------|
| Seed / health check | `seed.spec.ts` | Implemented |
| Suite 1: Page load & initial state | `suite1-initial-state.spec.ts` | Implemented |
| Suite 3: Completing todos | `suite3-completing.spec.ts` | Partially implemented (some skipped) |
| Suite 4: Deleting todos | `suite4-deleting.spec.ts` | Implemented |
| Suite 5: Progress stats | `suite5-progress.spec.ts` | Implemented |
| Suite 6: UI interactions | `suite6-ui.spec.ts` | Implemented |
| Suite 7: Edge cases | `suite7-edge-cases.spec.ts` | Implemented |
| Suite 8: Accessibility | `suite8-accessibility.spec.ts` | Implemented |
| **Suite 2: Adding todos** | `suite2-adding.spec.ts` | **Missing — needs creation** |

### E2E gaps to fill:

#### E2E: Suite 2 — Adding Todos (missing)
**Test file:** `tests/suite2-adding.spec.ts`

- **Describe**: Adding Todos
- **Cases**:
  - `2.1` add todo with default color — type `"Buy groceries"`, click add; expect item at top, input cleared, stats show 1/4 (25%)
  - `2.2` add todo with different color — select teal, type `"Walk the dog"`, add; expect todo present, teal selection ring visible
  - `2.3` add todo using Enter key — type `"Press enter test"`, press Enter; expect todo added
  - `2.4` add empty input does nothing — click add button with empty input; expect list unchanged (button is disabled)
  - `2.5` whitespace-only input does not add — type `"   "`, attempt add; expect button remains disabled, list unchanged
  - `2.6` special characters in text — type `"!@#$%^&*()"`, add; expect todo displayed with all characters
  - `2.7` unicode and emoji — type `"Hello 世界 🌍"`, add; expect correct display
  - `2.8` very long text (200+ chars) — type long string, add; expect todo added, layout intact
  - `2.9` multiple rapid additions — add 5 todos in quick succession; expect all 5 in list, newest first
  - `2.10` browser refresh clears new todos — add todo, refresh; expect only original 3 todos

#### E2E: Suite 3 — Fix skipped test
- `Test 3.1` is currently `test.skip` — unskip and verify selector works for completing incomplete todo

---

## Mock Strategy

- **Unit**: `vi.mock()` not required for any target files (no imports to mock). Use `vi.fn()` for callback props in component tests.
- **Component**: Use `@testing-library/react` `render()` + `userEvent` for interactions. No external services to mock.
- **E2E**: Real browser, real Vite dev server (`pnpm dev`). No mocks needed.

---

## Test Data (Fixtures)

```typescript
// Initial app state (hardcoded in App.tsx)
const initialTodos = [
  { id: 1, text: "学习孟菲斯设计风格", completed: false, color: "bg-[#FF6B9D]" },
  { id: 2, text: "创建一个酷炫的 Todo App", completed: true,  color: "bg-[#4ECDC4]" },
  { id: 3, text: "享受设计的乐趣",         completed: false, color: "bg-[#FFE66D]" },
]

// Reusable component test fixture
const incompleteTodo = { id: 1, text: "Buy milk",   completed: false, color: "bg-[#4ECDC4]" }
const completedTodo  = { id: 2, text: "Walk dog",   completed: true,  color: "bg-[#FF6B9D]" }

// Color palette
const COLORS = ["bg-[#FF6B9D]", "bg-[#4ECDC4]", "bg-[#FFE66D]", "bg-[#FF9F43]", "bg-[#A8E6CF]", "bg-[#C7CEEA]"]
const COLOR_HEX_MAP = {
  "bg-[#FF6B9D]": "#FF6B9D",
  "bg-[#4ECDC4]": "#4ECDC4",
  "bg-[#FFE66D]": "#FFE66D",
  "bg-[#FF9F43]": "#FF9F43",
  "bg-[#A8E6CF]": "#A8E6CF",
  "bg-[#C7CEEA]": "#C7CEEA",
}
```

---

## Setup Requirements for Unit/Component Tests

The project currently has **no Vitest or React Testing Library** configured. Before running unit/component tests, the test-generator must first install dependencies:

```bash
pnpm add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Add to `vite.config.ts` (or separate `vitest.config.ts`):
```typescript
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: ["./tests/setup.ts"],
}
```

Create `tests/setup.ts`:
```typescript
import "@testing-library/jest-dom"
```

Add to `package.json` scripts:
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest run --coverage"
```
