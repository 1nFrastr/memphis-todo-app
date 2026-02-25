// plan: specs/test-plan.md
// section: Unit: colorClassToHex
// source: src/lib/colorUtils.ts

import { describe, it, expect } from "vitest"
import { colorClassToHex } from "@/lib/colorUtils"

const COLORS = [
  "bg-[#FF6B9D]",
  "bg-[#4ECDC4]",
  "bg-[#FFE66D]",
  "bg-[#FF9F43]",
  "bg-[#A8E6CF]",
  "bg-[#C7CEEA]",
] as const

const COLOR_HEX_MAP: Record<string, string> = {
  "bg-[#FF6B9D]": "#FF6B9D",
  "bg-[#4ECDC4]": "#4ECDC4",
  "bg-[#FFE66D]": "#FFE66D",
  "bg-[#FF9F43]": "#FF9F43",
  "bg-[#A8E6CF]": "#A8E6CF",
  "bg-[#C7CEEA]": "#C7CEEA",
}

describe("colorClassToHex()", () => {
  it("extracts valid 6-digit hex from bg class", () => {
    expect(colorClassToHex("bg-[#FF6B9D]")).toBe("#FF6B9D")
  })

  it("extracts lowercase hex", () => {
    expect(colorClassToHex("bg-[#4ecdc4]")).toBe("#4ecdc4")
  })

  it("returns fallback #FF6B9D for non-matching string", () => {
    expect(colorClassToHex("bg-red-500")).toBe("#FF6B9D")
  })

  it("returns fallback for empty string", () => {
    expect(colorClassToHex("")).toBe("#FF6B9D")
  })

  it("handles all 6 COLORS constants correctly", () => {
    for (const color of COLORS) {
      expect(colorClassToHex(color)).toBe(COLOR_HEX_MAP[color])
    }
  })
})
