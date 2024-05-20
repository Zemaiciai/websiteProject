import { vi, describe, it, expect } from "vitest";
import {
  validateDate,
  validateEmail,
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
    interface RegisterErrors {
      email?: string;
      password?: string;
      firstname?: string;
      lastname?: string;
      username?: string;
      secretCode?: string;
      existingUser?: string;
      wrongCredentials?: string;
      wrongSecretCode?: string;
    }
    it("returns error object if undefined values are provided", async () => {
      const expectedErrors: RegisterErrors | null = {
        email: "El. pašto adresas privalomas",
        firstname: "Vardas privalomas",
        lastname: "Pavardė privaloma",
        password: "Slaptažodis privalomas",
        secretCode: "Pakvietimo kodas privalomas",
        username: "Slapyvardis privalomas",
      };
      const errors = await validateRegistrationCredentials(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(errors).toStrictEqual(expectedErrors);
    });

    it("returns error object if null values are provided", async () => {
      const expectedErrors: RegisterErrors | null = {
        email: "El. pašto adresas privalomas",
        firstname: "Vardas privalomas",
        lastname: "Pavardė privaloma",
        password: "Slaptažodis privalomas",
        secretCode: "Pakvietimo kodas privalomas",
        username: "Slapyvardis privalomas",
      };
      const errors = await validateRegistrationCredentials(
        null,
        null,
        null,
        null,
        null,
        null,
      );
      expect(errors).toStrictEqual(expectedErrors);
    });

    it("returns error object if bad firstname is provided", async () => {
      const expectedErrors: RegisterErrors | null = {
        firstname: "Vardas privalomas",
      };
      expect(
        await validateRegistrationCredentials(
          null,
          "a",
          "a",
          "a",
          "a@gmail.com",
          "aaaaaaa123",
        ),
      ).toStrictEqual(expectedErrors);
      expect(
        await validateRegistrationCredentials(
          null,
          "a",
          "a",
          "a",
          "a@gmail.com",
          "aaaaaaa123",
        ),
      ).toStrictEqual(expectedErrors);
      expect(
        await validateRegistrationCredentials(
          "          ",
          "a",
          "a",
          "a",
          "a@gmail.com",
          "aaaaaaa123",
        ),
      ).toStrictEqual(expectedErrors);
    });

    it("returns error object if bad lastname is provided", async () => {
      const expectedErrors: RegisterErrors | null = {
        firstname: "Vardas privalomas",
      };
      const errors = await validateRegistrationCredentials(
        null,
        "a",
        "a",
        "a",
        "a@gmail.com",
        "aaaaaaa123",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });

    it("returns error object if bad email is provided", async () => {
      const expectedErrors: RegisterErrors | null = {
        email: "El. pašto adresas netinkamas",
      };
      const errors = await validateRegistrationCredentials(
        "a",
        "a",
        "a",
        "a",
        "a",
        "aaaaaaa123",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
  });
});
