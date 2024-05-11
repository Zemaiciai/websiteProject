import { Decimal } from "@prisma/client/runtime/library";
import { getUserById } from "./user.server";
import { getGroupByName } from "./groups.server";
import { prisma } from "~/db.server";
import { group } from "console";

export async function createRecievingMoneyFromGroupLog(
  userId: string,
  whoDidChangesName: string,
  balanceFrom: number,
  balanceTo: number,
) {
  // Check if the user exists
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const groupName = "Grupė: " + whoDidChangesName;

  const input = "Buvo atliktas pinigų pervedimas iš grupės į vartotojo paskyrą";
  return prisma.userBalanceLog.create({
    data: {
      userId: user.id,
      whoDidChanges: groupName,
      description: input,
      balanceFrom: balanceFrom,
      balanceTo: balanceTo,
    },
  });
}

export async function getMoneyLogsByUserId(userid: string) {
  return prisma.userBalanceLog.findMany({
    where: {
      userId: userid,
    },
  });
}
