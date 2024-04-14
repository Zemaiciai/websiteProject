import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import { getUserByEmail, verifyLogin, User } from "~/models/user.server";
import { prisma } from "./db.server";
import {
  checkExpirationDateByEmail,
  getCodeByEmail,
} from "./models/secretCode.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function validateDate(date: unknown): date is Date {
  const currentDate = new Date();

  return date instanceof Date && date >= currentDate;
}
function validateUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;

  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  return urlRegex.test(url);
}
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

export async function validateRegistrationCredentials(
  firstname: unknown,
  lastname: unknown,
  username: unknown,
  secretCode: unknown,
  email: unknown,
  password: unknown,
  errors: RegisterErrors,
): Promise<RegisterErrors | null> {
  if (typeof firstname !== "string" || firstname === "") {
    errors.firstname = "Vardas privalomas";
  }
  if (typeof lastname !== "string" || lastname === "") {
    errors.lastname = "Pavardė privaloma";
  }
  if (typeof username !== "string" || username === "") {
    errors.username = "Slapyvardis privalomas";
  }
  if (typeof email !== "string" || email === "") {
    errors.email = "El. pašto adresas privalomas";
  } else if (email.length < 3 || !email.includes("@")) {
    errors.email = "El. pašto adresas netinkamas";
  } else {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      errors.existingUser = "Vartotojas su tuo pačiu el. paštu jau egzistuoja";
    }
  }
  if (typeof password !== "string" || password === "") {
    errors.password = "Slaptažodis privalomas";
  } else if (password.length < 8) {
    errors.password = "Slaptažodis per trumpas";
  }

  if (typeof secretCode !== "string" || secretCode === "") {
    errors.secretCode = "Pakvietimo kodas privalomas";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}

export async function validateLoginCredentials(
  email: unknown,
  password: unknown,
  errors: RegisterErrors,
): Promise<User | null> {
  if (typeof email !== "string") {
    errors.email = "El. pašto adresas privalomas";
  } else if (email.length < 3 || !email.includes("@")) {
    errors.email = "El. pašto adresas netinkamas";
  }
  if (typeof password !== "string" || password === "") {
    errors.password = "Slaptažodis privalomas";
  } else if (password.length < 8) {
    errors.password = "Slaptažodis per trumpas";
  }

  if (Object.keys(errors).length > 0) {
    return null;
  }

  const user = await verifyLogin(email as string, password as string);
  if (!user) {
    errors.wrongCredentials = "Neteisingas el. paštas arba slaptažodis";
    return null;
  }

  return user;
}

interface OrderErrors {
  revisionDays?: string;
  orderName?: string;
  completionDate?: string;
  workerEmail?: string;
  description?: string;
  footageLink?: string;
}

export async function validateOrderData(
  revisionDays: unknown,
  orderName: unknown,
  completionDate: unknown,
  workerEmail: unknown,
  description: unknown,
  footageLink: unknown,
): Promise<OrderErrors | null> {
  const errors: OrderErrors = {};
  const currentDate = new Date();

  if (typeof revisionDays !== "number") {
    errors.revisionDays = "Revizijos dienos turi buti skaicius";
  }

  if (!(completionDate instanceof Date)) {
    errors.completionDate = "Pabaigos data neteisingo formato";
  } else if (
    completionDate.getFullYear() === currentDate.getFullYear() &&
    completionDate.getMonth() === currentDate.getMonth() &&
    completionDate.getDate() === currentDate.getDate()
  ) {
    errors.completionDate = "Pabaigos data privaloma";
  } else if (!validateDate(completionDate)) {
    errors.completionDate = "Negalima pabaigos data";
  }

  if (typeof workerEmail === "string" && workerEmail.length <= 0) {
    errors.workerEmail = "Darbuotojo el. paštas privalomas";
  } else if (!validateEmail(workerEmail))
    errors.workerEmail = "Neteisingas darbuotojo el. paštas";

  if (typeof description !== "string")
    errors.description = "Aprašymo tipas neteisingas";
  else if (description.length > 500) errors.description = "Aprašymas per ilgas";

  if (typeof footageLink === "string" && footageLink.length <= 0)
    errors.footageLink = "Nuoroda privaloma";
  else if (!validateUrl(footageLink))
    errors.footageLink = "Nuorodos formatas neteisingas";

  if (typeof orderName !== "string" || orderName.length <= 0)
    errors.orderName = "Užsakymo pavadinimas privalomas";

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}

interface InviteCodeGenerationErrors {
  customName?: string;
  contractNumber?: string;
  roleSelection?: string;
  email?: string;
  code?: string;
  notExpired?: string;
  selectedPercentage?: string;
}
export async function validateInviteCodeGeneration(
  customName: unknown,
  contractNumber: unknown,
  roleSelection: unknown,
  email: unknown,
  code: unknown,
  selectedPercentage: unknown,
  errors: InviteCodeGenerationErrors,
): Promise<InviteCodeGenerationErrors | null> {
  //const errors: InviteCodeGenerationErrors = {};

  if (typeof customName !== "string" || customName.length <= 0) {
    errors.customName = "Pavadinimas yra privalomas";
  }
  if (typeof contractNumber !== "string" || contractNumber.length <= 0) {
    errors.contractNumber = "Kontrakto numeris yra privalomas";
  }
  if (roleSelection === "holder") {
    errors.roleSelection = "Role yra privaloma";
  }
  if (typeof email !== "string" || email === "") {
    errors.email = "El. pašto adresas privalomas";
  } else if (email.length < 3 || !email.includes("@")) {
    errors.email = "El. pašto adresas netinkamas";
  } else {
    if ((await checkExpirationDateByEmail(email)) === true) {
      errors.notExpired = "Kodo galiojimo laikas nėra pasibaiges";
    }
  }
  if (code === "holder") {
    errors.code = "Kodo galiojimas yra privalomas";
  }
  if (selectedPercentage === "holder" && roleSelection === "worker") {
    errors.selectedPercentage = "Privaloma pasirinkti";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}
