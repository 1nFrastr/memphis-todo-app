// plan: specs/test-plan.md
// section: Unit: Button component (shadcn/ui)
// source: src/components/ui/button.tsx

import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button, buttonVariants } from "@/components/ui/button"

describe("buttonVariants class generation", () => {
  it("default variant includes bg-primary and text-primary-foreground", () => {
    const cls = buttonVariants()
    expect(cls).toContain("bg-primary")
    expect(cls).toContain("text-primary-foreground")
  })

  it("destructive variant includes bg-destructive", () => {
    const cls = buttonVariants({ variant: "destructive" })
    expect(cls).toContain("bg-destructive")
  })

  it("outline variant includes border and bg-background", () => {
    const cls = buttonVariants({ variant: "outline" })
    expect(cls).toContain("border")
    expect(cls).toContain("bg-background")
  })

  it("ghost variant does NOT include bg-primary", () => {
    const cls = buttonVariants({ variant: "ghost" })
    expect(cls).not.toContain("bg-primary")
  })

  it("sm size includes h-8, px-3, text-xs", () => {
    const cls = buttonVariants({ size: "sm" })
    expect(cls).toContain("h-8")
    expect(cls).toContain("px-3")
    expect(cls).toContain("text-xs")
  })

  it("lg size includes h-10 and px-8", () => {
    const cls = buttonVariants({ size: "lg" })
    expect(cls).toContain("h-10")
    expect(cls).toContain("px-8")
  })

  it("icon size includes h-9 and w-9", () => {
    const cls = buttonVariants({ size: "icon" })
    expect(cls).toContain("h-9")
    expect(cls).toContain("w-9")
  })

  it("custom className merges into output", () => {
    const cls = buttonVariants({ className: "mt-4" })
    expect(cls).toContain("mt-4")
  })
})

describe("Button render", () => {
  it("renders as button element", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("disabled prop works", () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("additional className applies", () => {
    render(<Button className="text-xl">Styled</Button>)
    expect(screen.getByRole("button").className).toContain("text-xl")
  })
})
