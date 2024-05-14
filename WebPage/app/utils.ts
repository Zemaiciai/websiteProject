import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import {
  verifyLogin,
  User,
  checkIfUserNameExists,
  getUserById,
} from "~/models/user.server";
import { Notification } from "~/models/notification.server";
import { checkExpirationDateByEmail } from "./models/secretCode.server";
import {
  getCustomMessagesByMessage,
  getCustomMessagesByName,
} from "./models/customMessage.server";
import { aD } from "vitest/dist/reporters-P7C2ytIv";
import { checkUserAdsLimit } from "./models/workerAds.server";
import { prisma } from "./db.server";
import { OrderStatus } from "@prisma/client";
import OrdersTable from "./components/common/OrderPage/OrdersTable";

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

function isNotification(notification: unknown): notification is Notification {
  return (
    typeof notification === "object" &&
    notification !== null &&
    "id" in notification &&
    "recipientId" in notification &&
    "notificationType" in notification &&
    "message" in notification &&
    "isSeen" in notification &&
    "createdAt" in notification &&
    "updatedAt" in notification
  );
}

function isNotifications(
  notifications: unknown,
): notifications is Notification[] {
  if (!Array.isArray(notifications)) {
    return false;
  }

  return notifications.every((notification) => isNotification(notification));
}

export function useOptionalNotifications(): Notification[] | undefined {
  const data = useMatchesData("root");
  if (!data || !isNotifications(data.notifications)) {
    return undefined;
  }

  return data.notifications;
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
  } else if (await checkIfUserNameExists(username)) {
    errors.username = "Slapyvardis yra užimtas";
  }
  if (typeof email !== "string" || email === "") {
    errors.email = "El. pašto adresas privalomas";
  } else if (email.length < 3 || !email.includes("@")) {
    errors.email = "El. pašto adresas netinkamas";
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
  if (typeof email !== "string" || email.length <= 0) {
    errors.email = "El. pašto adresas privalomas";
  } else if (email.length < 3 || !email.includes("@")) {
    errors.email = "El. pašto adresas netinkamas";
  }
  if (typeof password !== "string" || password === "") {
    errors.password = "Slaptažodis privalomas";
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
  currentWorkerId: unknown,
  currentOrderStatus: unknown,
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
  } else if (!validateDate(completionDate)) {
    errors.completionDate = "Negalima pabaigos data";
  }

  if (typeof workerEmail === "string" && workerEmail.length <= 0) {
    errors.workerEmail = "Darbuotojo el. paštas privalomas";
  } else if (!validateEmail(workerEmail)) {
    errors.workerEmail = "Neteisingas darbuotojo el. paštas";
  } else if (
    currentOrderStatus === OrderStatus.ACCEPTED ||
    currentOrderStatus === OrderStatus.COMPLETED ||
    currentOrderStatus === OrderStatus.PAYED
  ) {
    const user = await getUserById(String(currentWorkerId));
    if (user?.email !== workerEmail) {
      errors.workerEmail =
        "Darbuotojas jau priėmė užsakymą todėl jo keisti negalite";
    }
  }

  if (typeof description !== "string")
    errors.description = "Aprašymo tipas neteisingas";
  else if (description.length > 500) errors.description = "Aprašymas per ilgas";

  if (typeof footageLink === "string" && footageLink.length <= 0)
    errors.footageLink = "Nuoroda privaloma";
  else if (!validateUrl(footageLink))
    errors.footageLink = "Nuorodos formatas neteisingas";

  if (typeof orderName !== "string" || orderName.trim().length <= 0)
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
interface InviteCustomMessagesErrors {
  customMessageName?: string;
  customMessageMessage?: string;
  customMessagePriority?: string;
}
export async function validateCustomMessage(
  customMessageName: unknown,
  customMessageMessage: unknown,
  customMessagePriority: unknown,
  errors: InviteCustomMessagesErrors,
): Promise<InviteCustomMessagesErrors | null> {
  //const errors: InviteCodeGenerationErrors = {};

  if (typeof customMessageName !== "string" || customMessageName.length <= 0) {
    errors.customMessageName = "Pavadinimas yra privalomas";
  } else if (await getCustomMessagesByName(customMessageName)) {
    errors.customMessageName = "Pranešimas su tokiu pavadinimu jau egzistuoja";
  }
  if (
    typeof customMessageMessage !== "string" ||
    customMessageMessage.length <= 0
  ) {
    errors.customMessageMessage = "Privaloma įvesti pranešimą";
  } else if (await getCustomMessagesByMessage(customMessageMessage)) {
    errors.customMessageMessage = "Pranešimas su tokia žinute jau egzistuoja";
  } else if (customMessageMessage.length <= 9) {
    errors.customMessageMessage = "Pranešimą turi sudaryti bent 10 simbolių";
  }
  if (customMessagePriority === "holder") {
    errors.customMessagePriority = "Privaloma pasirinkti svarbumą";
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}
interface ChangeUserInfoErrors {
  firstNameValidation?: string;
  lastNameValidation?: string;
  userNameValidation?: string;
  emailValidation?: string;
  roleValidation?: string;
  expirationDateValidation?: string;
}
export async function validateChangeUserInfo(
  firstNameValidation: unknown,
  lastNameValidation: unknown,
  userNameValidation: unknown,
  emailValidation: unknown,
  roleValidation: unknown,
  expirationDateValidation: unknown,
  errors: ChangeUserInfoErrors,
): Promise<ChangeUserInfoErrors | null> {
  if (
    typeof firstNameValidation !== "string" ||
    firstNameValidation.length <= 0
  ) {
    errors.firstNameValidation = "Vardas yra privalomas";
  }
  if (
    typeof lastNameValidation !== "string" ||
    lastNameValidation.length <= 0
  ) {
    errors.lastNameValidation = "Pavardė yra privaloma";
  }
  if (
    typeof userNameValidation !== "string" ||
    userNameValidation.length <= 0
  ) {
    errors.userNameValidation = "Slapyvardis yra privalomas";
  }
  if (typeof emailValidation !== "string" || emailValidation === "") {
    errors.emailValidation = "El. pašto adresas privalomas";
  } else if (emailValidation.length < 3 || !emailValidation.includes("@")) {
    errors.emailValidation = "El. pašto adresas netinkamas";
  }
  if (roleValidation === "holder") {
    errors.roleValidation = "Privaloma pasirinkti rolę";
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}
interface CreateWorkerAdErrors {
  adName?: string;
  adDescription?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  limit?: string;
}
export async function validateCreateWorkerAd(
  adName: string,
  adDescription: string,
  video1: string,
  video2: string,
  video3: string,
  errors: CreateWorkerAdErrors,
  userId: string,
): Promise<CreateWorkerAdErrors | null> {
  if (typeof adName !== "string" || adName.length <= 0) {
    errors.adName = "Pavadinimas yra privalomas";
  } else if (adName.length < 5) {
    errors.adName = "Pavadinimo ilgį turi sudaryti bent penki simboliai";
  } else if (adName.length > 100) {
    errors.adName = "Pavadinimo ilgis negali viršyti šimto simbolių";
  }
  if (typeof adDescription !== "string" || adDescription.length <= 0) {
    errors.adDescription = "Aprašymas yra privalomas";
  } else if (adDescription.length < 100) {
    errors.adDescription = "Aprašymą turi sudaryti bent šimtas simbolių";
  }
  const youtubePattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
  if (!youtubePattern.test(video1) && video1 != "") {
    errors.video1 = "Nuoroda neatitinka formato";
  }
  if (!youtubePattern.test(video2) && video2 != "") {
    errors.video2 = "Nuoroda neatitinka formato";
  }
  if (!youtubePattern.test(video3) && video3 != "") {
    errors.video3 = "Nuoroda neatitinka formato";
  }
  if (!(await checkUserAdsLimit(userId))) {
    errors.limit = "Pasiektas reklamų limitas (MAX 2)";
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  return null;
}
interface workExampleErrors {
  video1?: string;
  video2?: string;
  video3?: string;
  video4?: string;
  video5?: string;
}
export async function validateCreateWorkExample(
  video1: string,
  video2: string,
  video3: string,
  video4: string,
  video5: string,
  errors: workExampleErrors,
): Promise<workExampleErrors | null> {
  const youtubePattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
  if (!youtubePattern.test(video1) && video1 != "") {
    errors.video1 = "Nuoroda neatitinka formato";
  }
  if (!youtubePattern.test(video2) && video2 != "") {
    errors.video2 = "Nuoroda neatitinka formato";
  }
  if (!youtubePattern.test(video3) && video3 != "") {
    errors.video3 = "Nuoroda neatitinka formato";
  }
  if (!youtubePattern.test(video4) && video4 != "") {
    errors.video4 = "Nuoroda neatitinka formato";
  }
  if (!youtubePattern.test(video5) && video5 != "") {
    errors.video5 = "Nuoroda neatitinka formato";
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  return null;
}
interface CreateGroupsErrors {
  groupName?: string;
  groupShortDesc?: string;
  groupDescription?: string;
}
export async function validateCreateGroup(
  groupName: string,
  groupShortDesc: string,
  groupDescription: string,
  errors: CreateGroupsErrors,
  edit: boolean,
): Promise<CreateGroupsErrors | null> {
  if (typeof groupName !== "string" || groupName.length <= 0) {
    errors.groupName = "Pavadinimas yra privalomas";
  } else if (groupName.length < 5) {
    errors.groupName = "Pavadinimo ilgį turi sudaryti bent penki simboliai";
  } else if (groupName.length > 20) {
    errors.groupName = "Pavadinimo ilgis negali viršyti šimto simbolių";
  } else if (
    (await prisma.groups.findFirst({
      where: {
        groupName: groupName,
      },
    })) &&
    !edit
  ) {
    errors.groupName = "Grupe su tokiu pavadinimu jau egzistuoja";
  }
  if (typeof groupShortDesc !== "string" || groupShortDesc.length <= 0) {
    errors.groupShortDesc = "Apibūdinimas yra privalomas";
  } else if (groupShortDesc.length > 100) {
    errors.groupShortDesc = "Apibūdinimas negali viršyti šimto simbolių";
  } else if (groupShortDesc.length < 10) {
    errors.groupShortDesc = "Apibūdinimą turi sudaryti bent dešimt simbolių";
  }
  if (typeof groupDescription !== "string" || groupDescription.length <= 0) {
    errors.groupDescription = "Aprašymas yra privalomas";
  } else if (groupDescription.length < 100) {
    errors.groupDescription = "Aprašymą turi sudaryti bent šimtą simbolių";
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  return null;
}
