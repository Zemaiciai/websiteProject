import { Decimal } from "@prisma/client/runtime/library";
import { getUserById } from "./user.server";
import { getGroupByName } from "./groups.server";
import { prisma } from "~/db.server";

export async function createSendingMoneyLog(
  groupId: string,
  whoDidChangesID: string,
  whoGotMoney: string,
  balanceFrom: number,
  balanceTo: number,
) {
  // Check if the user exists
  const user = await getUserById(whoDidChangesID);
  if (!user) {
    throw new Error("User not found");
  }

  const input = "Buvo atliktas pinigų pervedimas į " + whoGotMoney + " paskyrą";
  return prisma.groupBalanceLog.create({
    data: {
      groupId: groupId,
      whoDidChanges: user.userName,
      description: input,
      balanceFrom: balanceFrom,
      balanceTo: balanceTo,
    },
  });
}
