import { GroupUser, Groups, GroupsRoles, User } from "@prisma/client";

import { getUserById } from "./user.server";
import { prisma } from "~/db.server";
import { Decimal } from "@prisma/client/runtime/library";
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
        balance: 0,
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
  inviteUserEmail: string,
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
      email: inviteUserEmail,
    },
  });

  if (!user) {
    throw new Error(`User with username ${inviteUserEmail} not found.`);
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

export async function groupInformationChange(
  groupName: string,
  groupNameChange: string,
  groupShortDescriptionChange: string,
  groupFullDescriptionChange: string,
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

  if (
    groupNameChange !== "" &&
    groupShortDescriptionChange !== "" &&
    groupFullDescriptionChange !== ""
  ) {
    return await prisma.groups.update({
      where: {
        id: group.id,
      },
      data: {
        groupName: groupNameChange,
        groupShortDescription: groupShortDescriptionChange,
        groupFullDescription: groupFullDescriptionChange,
      },
    });
  }
}

export async function removeUserFromGroup(
  groupID: string,
  removeUserEmail: string,
  whoMadeRequest: string,
) {
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
  const removeUser = await prisma.user.findFirst({
    where: {
      email: removeUserEmail,
    },
  });

  const whoMadeRequestToRemove = await prisma.user.findFirst({
    where: {
      id: whoMadeRequest,
    },
  });

  if (!removeUser) {
    throw new Error(`User with username ${removeUser} not found.`);
  }

  if (!whoMadeRequestToRemove) {
    throw new Error(`Who made request ${whoMadeRequestToRemove} not found.`);
  }

  const checkWhoMadeRequestRole = await prisma.groupUser.findFirst({
    where: {
      groupId: group.id,
      userId: whoMadeRequestToRemove.id,
    },
  });

  if (!checkWhoMadeRequestRole) {
    throw new Error(`Who made request ${checkWhoMadeRequestRole} not found.`);
  }

  if (checkWhoMadeRequestRole.role === GroupsRoles.MODERATOR) {
    const checkUserRole = await prisma.groupUser.findFirst({
      where: {
        groupId: group.id,
        userId: removeUser.id,
      },
    });

    if (
      checkUserRole?.role === GroupsRoles.MEMBER ||
      checkUserRole?.role === GroupsRoles.INVITED
    ) {
      const deletedUser = await prisma.groupUser.deleteMany({
        where: {
          userId: removeUser.id,
          groupId: group.id,
        },
      });
      return deletedUser;
    }
  }

  if (checkWhoMadeRequestRole.role === GroupsRoles.OWNER) {
    const checkUserRole = await prisma.groupUser.findFirst({
      where: {
        groupId: group.id,
        userId: removeUser.id,
      },
    });

    if (
      checkUserRole?.role === GroupsRoles.MEMBER ||
      checkUserRole?.role === GroupsRoles.MODERATOR ||
      checkUserRole?.role === GroupsRoles.INVITED
    ) {
      const deletedUser = await prisma.groupUser.deleteMany({
        where: {
          userId: removeUser.id,
          groupId: group.id,
        },
      });
      return deletedUser;
    }
  }

  return null;
}

export async function deleteGroup(groupID: string, whoUsingRN: string) {
  // Find the group by its id
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupID,
    },
  });

  if (!group) {
    throw new Error(`Group with name ${groupID} not found.`);
  }

  const checkWhoMadeRequestRole = await prisma.groupUser.findFirst({
    where: {
      groupId: group.id,
      userId: whoUsingRN,
    },
  });

  if (!checkWhoMadeRequestRole) {
    throw new Error(`User name ${checkWhoMadeRequestRole} not found.`);
  }

  if (Number(group.balance) !== 0) {
    return null;
  }

  if (checkWhoMadeRequestRole.role === GroupsRoles.OWNER) {
    await prisma.groupUser.deleteMany({
      where: {
        groupId: group.id,
      },
    });

    return await prisma.groups.deleteMany({
      where: {
        id: group.id,
      },
    });
  }
  return null;
}

export async function sendMoneyToUser(
  groupID: string,
  whoUsingRNID: string,
  userEmail: string,
  moneyAmount: Decimal,
) {
  // Find the group by its id
  const group = await prisma.groups.findFirst({
    where: {
      groupName: groupID,
    },
  });

  if (!group) {
    throw new Error(`Group with name ${groupID} not found.`);
  }

  const checkWhoMadeRequestRole = await prisma.groupUser.findFirst({
    where: {
      groupId: group.id,
      userId: whoUsingRNID,
    },
  });

  if (!checkWhoMadeRequestRole) {
    throw new Error(`User name ${checkWhoMadeRequestRole} not found.`);
  }

  const user = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    throw new Error(`User name ${user} not found.`);
  }

  const checkifuseringroup = await prisma.groupUser.findFirst({
    where: {
      userId: user.id,
      groupId: group.id,
    },
  });

  if (!checkifuseringroup) {
    return null;
  }

  const currentGroupBalance = group.balance;
  const changingGroupBalance =
    Number(currentGroupBalance) - Number(moneyAmount);

  const currentUserBalance = user.balance;
  const changingUserBalance = Number(currentUserBalance) + Number(moneyAmount);

  if (checkWhoMadeRequestRole.role === GroupsRoles.OWNER) {
    if (changingGroupBalance >= 0) {
      await prisma.groups.updateMany({
        where: {
          id: group.id,
        },
        data: {
          balance: changingGroupBalance,
        },
      });

      return await prisma.user.updateMany({
        where: {
          id: user.id,
        },
        data: {
          balance: changingUserBalance,
        },
      });
    }
  }

  return null;
}
