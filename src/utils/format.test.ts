import { describe, expect, it } from "vitest";
import {
  expenseDirectionAmountClass,
  expenseDirectionLabel,
  formatExpenseCategoryLine,
  formatMessageDayDivider,
  formatMessageTime,
  getMessageDayKey,
} from "./format";

describe("formatExpenseCategoryLine (Batch C)", () => {
  it("uses categoryLabel and subCategory for display", () => {
    expect(
      formatExpenseCategoryLine({
        category: "food_and_dining",
        categoryLabel: "Food & Dining",
        subCategory: "Snacks",
      }),
    ).toBe("Food & Dining · Snacks");
  });

  it("never shows the slug when categoryLabel is present", () => {
    expect(
      formatExpenseCategoryLine({
        category: "food_and_dining",
        categoryLabel: "Food & Dining",
      }),
    ).toBe("Food & Dining");
  });
});

describe("expenseDirectionAmountClass (Batch C)", () => {
  it("maps debit to expense red and credit to income green", () => {
    expect(expenseDirectionAmountClass("debit")).toBe("text-expense");
    expect(expenseDirectionAmountClass("credit")).toBe("text-income");
  });
});

describe("expenseDirectionLabel (Batch C)", () => {
  it("uses user-friendly labels", () => {
    expect(expenseDirectionLabel("debit")).toBe("Expense");
    expect(expenseDirectionLabel("credit")).toBe("Income");
  });
});

describe("formatMessageTime (Batch M1)", () => {
  it("formats in 12-hour clock with AM/PM", () => {
    expect(formatMessageTime("2026-08-27T15:53:00.000Z", "Asia/Kolkata")).toBe(
      "9:23 PM",
    );
    expect(formatMessageTime("2026-08-27T03:15:00.000Z", "Asia/Kolkata")).toBe(
      "8:45 AM",
    );
  });

  it("converts UTC to the requested timezone", () => {
    expect(formatMessageTime("2026-08-27T15:53:00.000Z", "America/New_York")).toBe(
      "11:53 AM",
    );
    expect(formatMessageTime("2026-08-27T15:53:00.000Z", "UTC")).toBe("3:53 PM");
  });

  it("returns the input when the timestamp is invalid", () => {
    expect(formatMessageTime("not-a-date", "Asia/Kolkata")).toBe("not-a-date");
  });
});

describe("formatMessageDayDivider (Batch M5)", () => {
  it("derives day keys in the requested timezone", () => {
    expect(getMessageDayKey("2026-08-27T20:00:00.000Z", "Asia/Kolkata")).toBe(
      "2026-08-28",
    );
    expect(getMessageDayKey("2026-08-27T20:00:00.000Z", "UTC")).toBe(
      "2026-08-27",
    );
  });

  it("labels older dates with a short date", () => {
    expect(
      formatMessageDayDivider("2026-08-20T12:00:00.000Z", "UTC"),
    ).toMatch(/20 Aug 2026/);
  });
});
