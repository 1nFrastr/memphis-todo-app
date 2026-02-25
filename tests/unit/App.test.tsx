// plan: specs/test-plan.md
// section: Component: App (integration of state + sub-components)
// source: src/App.tsx

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "@/App"

function getTodoItems(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>("div.space-y-4 > div")
  ).filter((el) => el.querySelector("button"))
}

describe("App — state management and rendering", () => {
  it("renders 3 initial todo items on mount", () => {
    const { container } = render(<App />)
    expect(getTodoItems(container)).toHaveLength(3)
  })

  it("renders progress showing 33% initially (1 of 3 complete)", () => {
    render(<App />)
    expect(screen.getByText("33%")).toBeInTheDocument()
  })

  it("addTodo adds new item to top of list", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.type(screen.getByPlaceholderText("添加新的任务..."), "New task")
    await user.click(container.querySelector<HTMLButtonElement>('button[type="submit"]')!)
    const items = getTodoItems(container)
    expect(items[0]).toHaveTextContent("New task")
  })

  it("toggleTodo marks incomplete todo as completed (strikethrough)", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const items = getTodoItems(container)
    // First todo (学习孟菲斯设计风格) is incomplete
    const toggleBtn = items[0].querySelector<HTMLButtonElement>("div.flex.items-center button")!
    await user.click(toggleBtn)
    expect(items[0].querySelector("span")).toHaveClass("line-through")
  })

  it("toggleTodo marks completed todo as incomplete", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const items = getTodoItems(container)
    // Second todo (创建一个酷炫的 Todo App) is initially completed
    const toggleBtn = items[1].querySelector<HTMLButtonElement>("div.flex.items-center button")!
    await user.click(toggleBtn)
    expect(items[1].querySelector("span")).not.toHaveClass("line-through")
  })

  it("deleteTodo removes todo from list", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const items = getTodoItems(container)
    const deleteBtn = items[0].querySelector<HTMLButtonElement>("button.relative.p-2")!
    await user.click(deleteBtn)
    expect(getTodoItems(container)).toHaveLength(2)
  })

  it("deleting all todos shows empty state message 还没有任务", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    for (let i = 0; i < 3; i++) {
      const items = getTodoItems(container)
      const deleteBtn = items[0].querySelector<HTMLButtonElement>("button.relative.p-2")!
      await user.click(deleteBtn)
    }
    expect(screen.getByText("还没有任务")).toBeInTheDocument()
  })

  it("completing all todos shows celebration banner", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const items = getTodoItems(container)
    // Complete item 0 (incomplete) and item 2 (incomplete); item 1 already done
    await user.click(items[0].querySelector<HTMLButtonElement>("div.flex.items-center button")!)
    await user.click(getTodoItems(container)[2].querySelector<HTMLButtonElement>("div.flex.items-center button")!)
    expect(screen.getByText("太棒了！所有任务都完成啦！")).toBeInTheDocument()
  })

  it("celebration banner hidden when not all complete", () => {
    render(<App />)
    expect(screen.queryByText("太棒了！所有任务都完成啦！")).not.toBeInTheDocument()
  })

  it("isAllCompleted is false with empty list (no banner shown)", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    for (let i = 0; i < 3; i++) {
      const items = getTodoItems(container)
      await user.click(items[0].querySelector<HTMLButtonElement>("button.relative.p-2")!)
    }
    expect(screen.queryByText("太棒了！所有任务都完成啦！")).not.toBeInTheDocument()
  })

  it("progress percentage updates after toggle (66%)", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const items = getTodoItems(container)
    // Complete item 0 (currently incomplete) → 2 of 3 done = 67% (Math.round)
    await user.click(items[0].querySelector<HTMLButtonElement>("div.flex.items-center button")!)
    const expected = `${Math.round((2 / 3) * 100)}%`
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it("each new todo gets a unique id — 5 items total after 2 additions", async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.type(screen.getByPlaceholderText("添加新的任务..."), "First{Enter}")
    await user.type(screen.getByPlaceholderText("添加新的任务..."), "Second{Enter}")
    expect(getTodoItems(container)).toHaveLength(5)
  })
})
