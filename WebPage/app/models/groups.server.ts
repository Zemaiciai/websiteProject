import { GroupsRoles, User } from "@prisma/client";
import { prisma } from "~/db.server";
import { getUserById } from "./user.server";

export async function createGroup(
  groupNameFromForm: string,
  groupShortDescriptionFromForm: string,
  groupFullDescriptionFromForm: string,
  owner: string,
) {
  // Check if the user exists
  const user = await getUserById(owner);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if a group with the same name already exists
  const existingGroup = await getGroupByName(groupNameFromForm);
  if (existingGroup) {
    return null;
  }

  // Create the group
  return prisma.groups.create({
    data: {
      groupName: groupNameFromForm,
      groupShortDescription: groupShortDescriptionFromForm,
      groupFullDescription: groupFullDescriptionFromForm,
      users: {
        create: {
          userId: user.id,
          role: GroupsRoles.OWNER,
        },
      },
    },
  });
}
export async function getGroupByName(groupName: string) {
  return prisma.groups.findFirst({ where: { groupName } });
}
