// plan: specs/test-plan.md
// section: Component: TodoItem
// source: src/components/todo/TodoComponents.tsx

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TodoItem } from "@/components/todo/TodoComponents"

const incompleteTodo = { id: 1, text: "Buy milk", completed: false, color: "bg-[#4ECDC4]" }
const completedTodo = { id: 2, text: "Walk dog", completed: true, color: "bg-[#FF6B9D]" }

describe("TodoItem — display and interaction", () => {
  it("renders todo text", () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText("Buy milk")).toBeInTheDocument()
  })

  it("incomplete todo has no line-through class on text", () => {
    render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const span = screen.getByText("Buy milk")
    expect(span.className).not.toContain("line-through")
  })

  it("completed todo renders with line-through class", () => {
    render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const span = screen.getByText("Walk dog")
    expect(span.className).toContain("line-through")
  })

  it("completed todo renders with reduced opacity", () => {
    const { container } = render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv.className).toContain("opacity-60")
  })

  it("incomplete todo does not have opacity-60", () => {
    const { container } = render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv.className).not.toContain("opacity-60")
  })

  it("completed checkbox shows Check icon (svg present inside toggle button)", () => {
    const { container } = render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const toggleBtn = container.querySelector<HTMLButtonElement>("div.flex.items-center button")
    expect(toggleBtn?.querySelector("svg")).toBeInTheDocument()
  })

  it("incomplete checkbox does not show Check icon", () => {
    const { container } = render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const toggleBtn = container.querySelector<HTMLButtonElement>("div.flex.items-center button")
    expect(toggleBtn?.querySelector("svg")).not.toBeInTheDocument()
  })

  it("background color is applied via inline style from color class", () => {
    const { container } = render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const outerDiv = container.firstChild as HTMLElement
    // jsdom normalizes hex → rgb; use toHaveStyle for hex-to-rgb comparison
    expect(outerDiv).toHaveStyle({ backgroundColor: "#4ECDC4" })
  })

  it("clicking toggle button calls onToggle with correct id", async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const { container } = render(<TodoItem todo={incompleteTodo} onToggle={onToggle} onDelete={vi.fn()} />)
    const toggleBtn = container.querySelector<HTMLButtonElement>("div.flex.items-center button")!
    await user.click(toggleBtn)
    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it("clicking delete button calls onDelete with correct id", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const { container } = render(<TodoItem todo={incompleteTodo} onToggle={vi.fn()} onDelete={onDelete} />)
    const deleteBtn = container.querySelector<HTMLButtonElement>("button.relative.p-2")!
    await user.click(deleteBtn)
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it("onToggle is called exactly once per click", async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const { container } = render(<TodoItem todo={incompleteTodo} onToggle={onToggle} onDelete={vi.fn()} />)
    const toggleBtn = container.querySelector<HTMLButtonElement>("div.flex.items-center button")!
    await user.click(toggleBtn)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
