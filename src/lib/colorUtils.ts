/** Extract hex color from a Tailwind arbitrary bg class like bg-[#FF6B9D] */
export function colorClassToHex(colorClass: string): string {
  const match = colorClass.match(/#[\da-fA-F]{6}/)
  return match ? match[0] : "#FF6B9D"
}
