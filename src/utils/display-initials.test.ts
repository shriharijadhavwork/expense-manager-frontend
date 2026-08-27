import { describe, expect, it } from "vitest";
import { getDisplayInitials } from "./display-initials";

describe("getDisplayInitials", () => {
  it("uses first and last letters across first/last names", () => {
    expect(getDisplayInitials("Shrihari Jadhav")).toBe("SV");
    expect(getDisplayInitials("John Public")).toBe("JC");
  });

  it("uses only the first letter for a single name", () => {
    expect(getDisplayInitials("Harry")).toBe("H");
    expect(getDisplayInitials("Flux")).toBe("F");
  });

  it("falls back to email local-part when name is missing", () => {
    expect(getDisplayInitials({ email: "shrihari@zithara.ai" })).toBe("S");
    expect(getDisplayInitials({ email: "harry.potter@example.com" })).toBe("H");
  });

  it("returns ? when no usable source exists", () => {
    expect(getDisplayInitials("")).toBe("?");
    expect(getDisplayInitials({ name: "   ", email: null })).toBe("?");
  });
});
