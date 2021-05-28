import { clamp } from "../math";

describe("clamp", () => {
  it("handles value within range", () => {
    expect(clamp(10, -10, 20)).toBe(10);
  });

  it("handles value under range", () => {
    expect(clamp(-10, -10, 20)).toBe(-10);
    expect(clamp(-11, -10, 20)).toBe(-10);
  });

  it("handles value over range", () => {
    expect(clamp(20, -10, 20)).toBe(20);
    expect(clamp(21, -10, 20)).toBe(20);
  });
});
