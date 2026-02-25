// plan: specs/test-plan.md
// section: Component: TodoInput
// source: src/components/todo/TodoComponents.tsx

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TodoInput } from "@/components/todo/TodoComponents"

const COLORS = [
  "bg-[#FF6B9D]",
  "bg-[#4ECDC4]",
  "bg-[#FFE66D]",
  "bg-[#FF9F43]",
  "bg-[#A8E6CF]",
  "bg-[#C7CEEA]",
] as const

describe("TodoInput — form behavior and controlled state", () => {
  it("renders input field with placeholder 添加新的任务...", () => {
    render(<TodoInput onAdd={vi.fn()} />)
    expect(screen.getByPlaceholderText("添加新的任务...")).toBeInTheDocument()
  })

  it("renders 6 color selector buttons", () => {
    render(<TodoInput onAdd={vi.fn()} />)
    const colorBtns = screen.getAllByRole("button", { name: "" }).filter(
      (btn) => btn.getAttribute("type") === "button"
    )
    expect(colorBtns).toHaveLength(6)
  })

  it("first color is selected by default (ring-4 class)", () => {
    const { container } = render(<TodoInput onAdd={vi.fn()} />)
    const colorBtns = container.querySelectorAll<HTMLButtonElement>('button[type="button"]')
    expect(colorBtns[0].className).toContain("ring-4")
  })

  it("submit button is disabled when input is empty", () => {
    const { container } = render(<TodoInput onAdd={vi.fn()} />)
    const submitBtn = container.querySelector<HTMLButtonElement>('button[type="submit"]')!
    expect(submitBtn).toBeDisabled()
  })

  it("submit button is enabled when input has non-whitespace text", async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)
    await user.type(screen.getByPlaceholderText("添加新的任务..."), "Hello")
    const submitBtn = document.querySelector<HTMLButtonElement>('button[type="submit"]')
    expect(submitBtn).not.toBeDisabled()
  })

  it("submit button remains disabled for whitespace-only input", async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)
    await user.type(screen.getByPlaceholderText("添加新的任务..."), "   ")
    const submitBtn = document.querySelector<HTMLButtonElement>('button[type="submit"]')
    expect(submitBtn).toBeDisabled()
  })

  it("calls onAdd with trimmed text and selected color on submit", async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)
    await user.type(screen.getByPlaceholderText("添加新的任务..."), " Buy milk ")
    await user.click(document.querySelector<HTMLButtonElement>('button[type="submit"]')!)
    expect(onAdd).toHaveBeenCalledWith("Buy milk", COLORS[0])
  })

  it("clears input after successful submit", async () => {
    const user = userEvent.setup()
    render(<TodoInput onAdd={vi.fn()} />)
    const input = screen.getByPlaceholderText("添加新的任务...")
    await user.type(input, "test")
    await user.click(document.querySelector<HTMLButtonElement>('button[type="submit"]')!)
    expect(input).toHaveValue("")
  })

  it("does not call onAdd on submit with empty input", async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    const { container } = render(<TodoInput onAdd={onAdd} />)
    const form = container.querySelector("form")!
    form.dispatchEvent(new Event("submit", { bubbles: true }))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it("selecting a different color updates selection ring", async () => {
    const user = userEvent.setup()
    const { container } = render(<TodoInput onAdd={vi.fn()} />)
    const colorBtns = container.querySelectorAll<HTMLButtonElement>('button[type="button"]')
    await user.click(colorBtns[1])
    expect(colorBtns[1].className).toContain("ring-4")
    expect(colorBtns[0].className).not.toContain("ring-4")
  })

  it("calls onAdd with the selected color after switching", async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    const { container } = render(<TodoInput onAdd={onAdd} />)
    const colorBtns = container.querySelectorAll<HTMLButtonElement>('button[type="button"]')
    await user.click(colorBtns[1]) // teal
    await user.type(screen.getByPlaceholderText("添加新的任务..."), "Task")
    await user.click(container.querySelector<HTMLButtonElement>('button[type="submit"]')!)
    expect(onAdd).toHaveBeenCalledWith("Task", COLORS[1])
  })

  it("pressing Enter submits the form", async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)
    await user.type(screen.getByPlaceholderText("添加新的任务..."), "Enter test{Enter}")
    expect(onAdd).toHaveBeenCalledWith("Enter test", COLORS[0])
  })
})
