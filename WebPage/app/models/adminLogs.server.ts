import { prisma } from "~/db.server";

export async function createBanLog(
  userWhichWasBanned: string,
  banReason: string,
  admin: string,
) {
  const info =
    "Užlokavo vartotoją kurio el. paštas " +
    userWhichWasBanned +
    " su priežastimi " +
    banReason;
  return prisma.adminLogs.create({
    data: {
      user: admin,
      information: info,
    },
  });
}

export async function createUnBanLog(
  userWhichWasUnBanned: string,
  admin: string,
) {
  const info = "Atblokavo vartotoją kurio el. paštas " + userWhichWasUnBanned;
  return prisma.adminLogs.create({
    data: {
      user: admin,
      information: info,
    },
  });
}

export async function createWarningLog(
  userWhichWasWarned: string,
  warningReason: string,
  admin: string,
) {
  const info =
    "Uždėjo įspėjimą vartotojui kurio el. paštas " +
    userWhichWasWarned +
    " su priežastimi " +
    warningReason;
  return prisma.adminLogs.create({
    data: {
      user: admin,
      information: info,
    },
  });
}
