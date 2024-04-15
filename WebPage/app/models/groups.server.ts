import { GroupUser, Groups, GroupsRoles, User } from "@prisma/client";

import { getUserById } from "./user.server";
import { prisma } from "~/db.server";
interface OwnerGroup {
  group: Groups;
  owner: GroupUser & { user: User | null };
}
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

export async function getAllGroups() {
  return prisma.groups.findMany();
}

export async function getGroupByUserId(userId: string) {
  return prisma.groups.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
  });
}

export async function getGroupsOfUserOwners(userId: string) {
  try {
    // Fetch all groups that the user is in
    const userGroups = await prisma.groupUser.findMany({
      where: {
        userId,
      },
      include: {
        group: true,
      },
    });

    const ownerGroups: OwnerGroup[] = [];

    // Iterate through each userGroup and find the owner for the group
    for (const userGroup of userGroups) {
      // Check if the user has the role of 'OWNER' for this group
      if (userGroup.role === GroupsRoles.OWNER) {
        // Get the owner information
        const owner = await prisma.groupUser.findFirst({
          where: {
            groupId: userGroup.groupId,
            role: GroupsRoles.OWNER,
          },
          include: {
            user: true,
          },
        });

        // If owner is found, push the group and owner to the ownerGroups array
        if (owner) {
          ownerGroups.push({
            group: userGroup.group,
            owner,
          });
        }
      }
    }

    // Fetch the username for each owner
    for (const ownerGroup of ownerGroups) {
      const user = await prisma.user.findUnique({
        where: {
          id: ownerGroup.owner.userId,
        },
      });
      ownerGroup.owner.user = user; // Update the owner object with the user information
    }

    return ownerGroups;
  } catch (error) {
    console.error("Error fetching owner groups:", error);
    throw error;
  }
}

export async function getAllGroupsAndOwners() {
  try {
    // Fetch all groups
    const allGroups = await prisma.groups.findMany();

    const ownerGroups: OwnerGroup[] = [];

    // Iterate through each group and find the owner
    for (const group of allGroups) {
      // Get the owner information
      const owner = await prisma.groupUser.findFirst({
        where: {
          groupId: group.id,
          role: GroupsRoles.OWNER,
        },
        include: {
          user: true,
        },
      });

      // If owner is found, push the group and owner to the ownerGroups array
      if (owner) {
        ownerGroups.push({
          group,
          owner,
        });
      }
    }

    // Fetch the username for each owner
    for (const ownerGroup of ownerGroups) {
      const user = await prisma.user.findUnique({
        where: {
          id: ownerGroup.owner.userId,
        },
      });
      ownerGroup.owner.user = user; // Update the owner object with the user information
    }

    return ownerGroups;
  } catch (error) {
    console.error("Error fetching groups and owners:", error);
    throw error;
  }
}
