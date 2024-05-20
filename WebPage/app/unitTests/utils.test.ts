import { vi, describe, it, expect } from "vitest";
import {
  validateDate,
  validateEmail,
  validateOrderData,
  validateRegistrationCredentials,
  validateUrl,
} from "../utils";

vi.mock("../models/user.server", () => ({
  checkIfUserNameExists: vi.fn().mockResolvedValue(false),
}));

describe("utils validation tests", () => {
  describe("Validate email", () => {
    it("returns false for non-emails", () => {
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("not-an-email")).toBe(false);
      expect(validateEmail("n@")).toBe(false);
    });

    it("returns true for emails", () => {
      expect(validateEmail("kody@example.com")).toBe(true);
    });
  });

  describe("Validate order completion date ", () => {
    const currentDate = new Date();
    const badCompletionDate = new Date(
      new Date().setMonth(currentDate.getMonth() - 1),
    );
    const goodCompletionDate = new Date(
      new Date().setMonth(currentDate.getMonth() + 1),
    );

    it("returns false if completionDate < currentDate", () => {
      console.log("bad completionDate: ", badCompletionDate.toLocaleString());
      console.log("currentDate: ", currentDate.toLocaleString());
      expect(validateDate(undefined)).toBe(false);
      expect(validateDate(null)).toBe(false);
      expect(validateDate(badCompletionDate)).toBe(false);
    });

    it("returns true if completionDate >= currentDate", () => {
      console.log("Good completionDate", goodCompletionDate.toLocaleString());
      console.log("currentDate: ", currentDate.toLocaleString());
      expect(validateDate(goodCompletionDate)).toBe(true);
    });
  });
  describe("Validate url", () => {
    it("returns false for non-urls", () => {
      expect(validateUrl(undefined)).toBe(false);
      expect(validateDate(null)).toBe(false);
      expect(validateDate("non-url")).toBe(false);
      expect(validateDate("https://non-url")).toBe(false);
      expect(validateDate("https://.com")).toBe(false);
      expect(validateDate("link.com")).toBe(false);
      expect(validateDate("     https://link.com")).toBe(false);
    });

    it("returns true for correct urls", () => {
      expect(validateUrl("https://link.com")).toBe(true);
    });
  });

  describe("Validate entered registration values", () => {
    it("returns error object if empty, undefined or null strings are provided", async () => {
      const invalidStrings = [undefined, null, "     "];
      invalidStrings.forEach(async (badString) => {
        const result = await validateRegistrationCredentials(
          badString,
          badString,
          badString,
          badString,
          badString,
          badString,
        );
        expect(result).toBeTypeOf("object");
      });
    });

    it("returns null if valid strings are provided", async () => {
      const result = await validateRegistrationCredentials(
        "firstname",
        "lastname",
        "username",
        "secretCode",
        "email@gmail.com",
        "password",
      );
      expect(result).toBe(null);
    });
  });

  describe("Validate entered order values", () => {
    it("returns error object if empty, undefined or null strings are provided", async () => {
      const invalidStrings = [undefined, null, "     "];
      invalidStrings.forEach(async (badString) => {
        const result = await validateOrderData(
          badString,
          badString,
          badString,
          badString,
          badString,
          badString,
        );
        expect(result).toBeTypeOf("object");
      });
    });

    it("returns null if valid strings are provided", async () => {
      const result = await validateOrderData(
        1,
        "orderName",
        new Date(),
        "workerEmail@gmail.com",
        "description",
        "https://valid-footage-link.com",
      );
      expect(result).toBe(null);
    });
  });
});
