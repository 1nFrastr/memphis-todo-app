// plan: specs/test-plan.md
// section: Unit: TodoStats component
// source: src/components/todo/TodoComponents.tsx

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TodoStats } from "@/components/todo/TodoComponents"

describe("TodoStats — percentage calculation and rendering", () => {
  it("renders 0% when no todos exist", () => {
    render(<TodoStats total={0} completed={0} />)
    expect(screen.getByText("0%")).toBeInTheDocument()
    expect(screen.getByText("0 / 0 任务完成")).toBeInTheDocument()
  })

  it("renders 33% for 1 of 3 completed", () => {
    render(<TodoStats total={3} completed={1} />)
    expect(screen.getByText("33%")).toBeInTheDocument()
    expect(screen.getByText("1 / 3 任务完成")).toBeInTheDocument()
  })

  it("renders 100% when all complete", () => {
    render(<TodoStats total={5} completed={5} />)
    expect(screen.getByText("100%")).toBeInTheDocument()
    expect(screen.getByText("5 / 5 任务完成")).toBeInTheDocument()
  })

  it("rounds correctly for 2 of 3 completed", () => {
    render(<TodoStats total={3} completed={2} />)
    const expected = `${Math.round((2 / 3) * 100)}%`
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it("progress bar width style equals percentage", () => {
    const { container } = render(<TodoStats total={4} completed={2} />)
    const bar = container.querySelector<HTMLElement>(".bg-gradient-to-r")
    expect(bar?.style.width).toBe("50%")
  })

  it("shows 进度 heading", () => {
    render(<TodoStats total={1} completed={0} />)
    expect(screen.getByRole("heading", { name: "进度" })).toBeInTheDocument()
  })
})
