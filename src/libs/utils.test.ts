import { describe, it, expect } from "vitest";
import { cn, formatNumber, formatDate, getErrorMessage } from "./utils";
import { AxiosError } from "axios";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("handles undefined and null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});

describe("formatNumber", () => {
  it("formats with default options", () => {
    expect(formatNumber(1234.5)).toBe("1,234.5");
  });

  it("returns 0 for NaN", () => {
    expect(formatNumber(NaN)).toBe("0");
  });

  it("returns 0 for nullish", () => {
    expect(formatNumber(null as unknown as number)).toBe("0");
  });

  it("respects min/max fraction digits", () => {
    expect(formatNumber(5, { minFracDigits: 2, maxFracDigits: 2 })).toBe("5.00");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2025-01-15T00:00:00Z");
    expect(result).toBe("Jan 15, 2025");
  });

  it("returns dash for null", () => {
    expect(formatDate(undefined)).toBe("-");
  });

  it("accepts custom format", () => {
    const result = formatDate("2025-01-15T00:00:00Z", "yyyy-MM-dd");
    expect(result).toBe("2025-01-15");
  });
});

describe("getErrorMessage", () => {
  it("returns message from response data", () => {
    const error = new AxiosError(undefined, undefined, undefined, undefined, {
      status: 400,
      data: { message: "Bad request" },
    } as any);
    expect(getErrorMessage(error)).toBe("Bad request");
  });

  it("returns fallback when no message", () => {
    const error = new AxiosError(undefined, undefined, undefined, undefined, {
      status: 500,
      data: {},
    } as any);
    expect(getErrorMessage(error)).toBe("Something wrong.");
  });
});
