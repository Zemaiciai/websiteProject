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

  if (
    groupNameFromForm !== "" &&
    groupShortDescriptionFromForm !== "" &&
    groupFullDescriptionFromForm !== "" &&
    owner !== ""
  ) {
    // Create the group
    return prisma.groups.create({
      data: {
        groupName: groupNameFromForm,
        groupShortDescription: groupShortDescriptionFromForm,
        groupFullDescription: groupFullDescriptionFromForm,
        balance: "0",
        users: {
          create: {
            userId: user.id,
            role: GroupsRoles.OWNER,
          },
        },
      },
    });
  }
  return null;
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
export async function getAllGroupUsers(groupName: string) {
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupName,
    },
  });

  const groupUsers = await prisma.groupUser.findMany({
    where: {
      groupId: group?.id,
    },
    include: {
      user: true,
    },
  });

  return groupUsers.map((groupUser) => ({
    ...groupUser.user,
    role: groupUser.role, // Include the role directly from groupUser
  }));
}

export async function invitingUserToGroup(
  groupName: string,
  inviteUserName: string,
) {
  // Find the group by its name
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupName,
    },
  });

  if (!group) {
    throw new Error(`Group with name ${groupName} not found.`);
  }

  // Find the user by their username
  const user = await prisma.user.findFirst({
    where: {
      userName: inviteUserName,
    },
  });

  if (!user) {
    throw new Error(`User with username ${inviteUserName} not found.`);
  }

  // Check if the user has already been invited to the group
  const existingInvite = await prisma.groupUser.findFirst({
    where: {
      userId: user.id,
      groupId: group.id,
    },
  });

  if (existingInvite) {
    return null;
  }

  // Create a new GroupUser entry with the INVITED role
  return await prisma.groupUser.create({
    data: {
      userId: user.id,
      groupId: group.id,
      role: GroupsRoles.INVITED,
    },
  });
}

export async function acceptInvite(groupID: string, inviteUserID: string) {
  // Find the group by its id
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupID,
    },
  });

  if (!group) {
    throw new Error(`Group with name ${groupID} not found.`);
  }

  // Find the user by their id
  const user = await prisma.user.findFirst({
    where: {
      id: inviteUserID,
    },
  });

  if (!user) {
    throw new Error(`User with username ${inviteUserID} not found.`);
  }

  // Update the user's role to MEMBER for the specific group
  const updatedUser = await prisma.groupUser.updateMany({
    where: {
      userId: user.id,
      groupId: group.id,
    },
    data: {
      role: GroupsRoles.MEMBER,
    },
  });

  return updatedUser;
}

export async function cancelInvite(groupID: string, inviteUserID: string) {
  // Find the group by its id
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupID,
    },
  });

  if (!group) {
    throw new Error(`Group with name ${groupID} not found.`);
  }

  // Find the user by their id
  const user = await prisma.user.findFirst({
    where: {
      id: inviteUserID,
    },
  });

  if (!user) {
    throw new Error(`User with username ${inviteUserID} not found.`);
  }

  // Delete the user from groupUsers
  const deletedUser = await prisma.groupUser.deleteMany({
    where: {
      userId: user.id,
      groupId: group.id,
    },
  });

  return deletedUser;
}

export async function leaveGroup(groupID: string, inviteUserID: string) {
  // Find the group by its id
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupID,
    },
  });

  if (!group) {
    throw new Error(`Group with name ${groupID} not found.`);
  }

  // Find the user by their id
  const user = await prisma.user.findFirst({
    where: {
      id: inviteUserID,
    },
  });

  if (!user) {
    throw new Error(`User with username ${inviteUserID} not found.`);
  }
  if (user.role !== GroupsRoles.OWNER) {
    const deletedUser = await prisma.groupUser.deleteMany({
      where: {
        userId: user.id,
        groupId: group.id,
      },
    });

    return deletedUser;
  }
  return null;
}

export async function groupMemberRoleChange(
  groupName: string,
  userEmail: string,
  roleToChange: string,
) {
  // Find the group by its name
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupName,
    },
  });

  if (!group) {
    throw new Error(`Group with name ${groupName} not found.`);
  }

  // Find the user by their email
  const user = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    throw new Error(`User with email ${userEmail} not found.`);
  }

  if (roleToChange === "member") {
    return await prisma.groupUser.updateMany({
      where: {
        userId: user.id,
        groupId: group.id,
      },
      data: {
        role: GroupsRoles.MEMBER, // Assuming "MEMBER" is a valid role
      },
    });
  }
  if (roleToChange === "moderator") {
    return await prisma.groupUser.updateMany({
      where: {
        userId: user.id,
        groupId: group.id,
      },
      data: {
        role: GroupsRoles.MODERATOR, // Assuming "MEMBER" is a valid role
      },
    });
  }

  if (roleToChange === "owner") {
    return await prisma.groupUser.updateMany({
      where: {
        userId: user.id,
        groupId: group.id,
      },
      data: {
        role: GroupsRoles.OWNER, // Assuming "MEMBER" is a valid role
      },
    });
  }
}
