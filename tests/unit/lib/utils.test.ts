// plan: specs/test-plan.md
// section: Unit: cn utility
// source: src/lib/utils.ts

import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn()", () => {
  it("returns single class string unchanged", () => {
    expect(cn("foo")).toBe("foo")
  })

  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("deduplicates conflicting Tailwind utilities", () => {
    expect(cn("p-4", "p-2")).toBe("p-2")
  })

  it("ignores falsy values", () => {
    expect(cn("foo", false, null, undefined, 0)).toBe("foo")
  })

  it("handles empty call", () => {
    expect(cn()).toBe("")
  })

  it("conditional object syntax", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo")
  })

  it("array input", () => {
    expect(cn(["a", "b"])).toBe("a b")
  })

  it("merges background color conflicts — last wins", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
  })
})
