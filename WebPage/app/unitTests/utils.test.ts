import { describe, it, expect } from "vitest";
import { validateEmail } from "../utils";
import { checkIfUserNameExists } from "../models/user.server";

describe("validateEmail function", () => {
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

describe("validate checkIfUserNameExists", () => {
  it("returns false if username doesn't exist", async () => {
    expect(await checkIfUserNameExists("")).toBe(false);
  });
  it("returns true if username exits", async () => {
    expect(await checkIfUserNameExists("Darbuotojas")).toBe(false);
  });
});
