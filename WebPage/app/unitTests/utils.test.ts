import { vi, describe, it, expect } from "vitest";
import {
  validateChangeUserInfo,
  validateCustomMessage,
  validateDate,
  validateEmail,
  validateLoginCredentials,
  validateOrderData,
  validateRegistrationCredentials,
  validateUrl,
} from "../utils";

vi.mock("../models/user.server", () => ({
  checkIfUserNameExists: vi.fn().mockResolvedValue(false),
  verifyLogin: vi.fn().mockResolvedValue(true),
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
  // LOGIN ------------------------------------------------
  describe("Validate entered login values", () => {
    interface LoginErrors {
      email?: string;
      password?: string;
      wrongCredentials?: string;
    }
    it("returns error object if undefined values are provided", async () => {
      const expectedErrors: LoginErrors | null = {
        email: "El. pašto adresas privalomas",
        password: "Slaptažodis privalomas",
      };
      const errors = await validateLoginCredentials(undefined, undefined);
      expect(errors).toStrictEqual(expectedErrors);
    });

    it("returns error object if null values are provided", async () => {
      const expectedErrors: LoginErrors | null = {
        email: "El. pašto adresas privalomas",
        password: "Slaptažodis privalomas",
      };
      const errors = await validateLoginCredentials(null, null);
      expect(errors).toStrictEqual(expectedErrors);
    });

    it("returns error object if email isnt provided", async () => {
      const expectedErrors: LoginErrors | null = {
        email: "El. pašto adresas privalomas",
      };
      expect(await validateLoginCredentials(null, "a")).toStrictEqual(
        expectedErrors,
      );
    });

    it("returns error object if password isnt provided", async () => {
      const expectedErrors: LoginErrors | null = {
        password: "Slaptažodis privalomas",
      };
      const errors = await validateLoginCredentials("aasd@gmail.com", null);
      expect(errors).toStrictEqual(expectedErrors);
    });

    it("returns error object if bad email is provided", async () => {
      const expectedErrors: LoginErrors | null = {
        email: "El. pašto adresas netinkamas",
      };
      const errors = await validateLoginCredentials("a", "aaaaaaa123");
      expect(errors).toStrictEqual(expectedErrors);
    });
  });
  // LOGIN ------------------------------------------------
  // CUSTOM MESSAGE------------------------------------------------
  describe("Validate entered custom message values", () => {
    interface InviteCustomMessagesErrors {
      customMessageName?: string;
      customMessageMessage?: string;
      customMessagePriority?: string;
    }
    it("returns error object if values are not provided", async () => {
      const expectedErrors: InviteCustomMessagesErrors | null = {
        customMessageName: "Pavadinimas yra privalomas",
        customMessageMessage: "Privaloma įvesti pranešimą",
        customMessagePriority: "Privaloma pasirinkti svarbumą",
      };
      const errors = await validateCustomMessage(
        undefined,
        undefined,
        "holder",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if name is not provided", async () => {
      const expectedErrors: InviteCustomMessagesErrors | null = {
        customMessageName: "Pavadinimas yra privalomas",
      };
      const errors = await validateCustomMessage(
        undefined,
        "undefinasdasdd",
        "1",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if message is not provided", async () => {
      const expectedErrors: InviteCustomMessagesErrors | null = {
        customMessageMessage: "Privaloma įvesti pranešimą",
      };
      const errors = await validateCustomMessage("undefined", undefined, "1");
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if priority isnt selected is not provided", async () => {
      const expectedErrors: InviteCustomMessagesErrors | null = {
        customMessagePriority: "Privaloma pasirinkti svarbumą",
      };
      const errors = await validateCustomMessage(
        "undefined",
        "asdasdasdassdadasd",
        "holder",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if message is too short", async () => {
      const expectedErrors: InviteCustomMessagesErrors | null = {
        customMessageMessage: "Pranešimą turi sudaryti bent 10 simbolių",
      };
      const errors = await validateCustomMessage("undefined", "a", "1");
      expect(errors).toStrictEqual(expectedErrors);
    });
  });
  // CUSTOM MESSAGE------------------------------------------------
  // USERINFOCHANGE------------------------------------------------
  describe("Validate user info change values", () => {
    interface ChangeUserInfoErrors {
      firstNameValidation?: string;
      lastNameValidation?: string;
      userNameValidation?: string;
      emailValidation?: string;
      roleValidation?: string;
      expirationDateValidation?: string;
    }
    it("returns error object if values are not provided", async () => {
      const expectedErrors: ChangeUserInfoErrors | null = {
        firstNameValidation: "Vardas yra privalomas",
        lastNameValidation: "Pavardė yra privaloma",
        userNameValidation: "Slapyvardis yra privalomas",
        emailValidation: "El. pašto adresas privalomas",
        roleValidation: "Privaloma pasirinkti rolę",
      };
      const errors = await validateChangeUserInfo(
        undefined,
        undefined,
        undefined,
        undefined,
        "holder",
        undefined,
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if firstname is not provided", async () => {
      const expectedErrors: ChangeUserInfoErrors | null = {
        firstNameValidation: "Vardas yra privalomas",
      };
      const errors = await validateChangeUserInfo(
        undefined,
        "undefined",
        "undefined",
        "undefined@",
        "Darbuotojas",
        "undefined",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if lastname is not provided", async () => {
      const expectedErrors: ChangeUserInfoErrors | null = {
        lastNameValidation: "Pavardė yra privaloma",
      };
      const errors = await validateChangeUserInfo(
        "undefined",
        undefined,
        "undefined",
        "undefined@",
        "Darbuotojas",
        "undefined",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if username is not provided", async () => {
      const expectedErrors: ChangeUserInfoErrors | null = {
        userNameValidation: "Slapyvardis yra privalomas",
      };
      const errors = await validateChangeUserInfo(
        "undefined",
        "undefined",
        undefined,
        "undefined@",
        "Darbuotojas",
        "undefined",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if email is not provided", async () => {
      const expectedErrors: ChangeUserInfoErrors | null = {
        emailValidation: "El. pašto adresas privalomas",
      };
      const errors = await validateChangeUserInfo(
        "undefined",
        "undefined",
        "undefined",
        undefined,
        "Darbuotojas",
        "undefined",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if email is not valid", async () => {
      const expectedErrors: ChangeUserInfoErrors | null = {
        emailValidation: "El. pašto adresas netinkamas",
      };
      const errors = await validateChangeUserInfo(
        "undefined",
        "undefined",
        "undefined",
        "undefined",
        "Darbuotojas",
        "undefined",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
    it("returns error object if role is not provided", async () => {
      const expectedErrors: ChangeUserInfoErrors | null = {
        roleValidation: "Privaloma pasirinkti rolę",
      };
      const errors = await validateChangeUserInfo(
        "undefined",
        "undefined",
        "undefined",
        "undefined@",
        "holder",
        "undefined",
      );
      expect(errors).toStrictEqual(expectedErrors);
    });
  });
});
