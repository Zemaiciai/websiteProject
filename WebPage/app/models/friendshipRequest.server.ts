import { redirect } from "remix-typedjson";
import { prisma } from "~/db.server";
import { sendNotification } from "./notification.server";
import { NotificationTypes } from "@prisma/client";
import { getUserById } from "./user.server";

export async function createFriendshipRequest(
  requesterId: string,
  requestedUserId: string,
) {
  try {
    // Check if both users exist
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });
    const requestedUser = await prisma.user.findUnique({
      where: { id: requestedUserId },
    });

    if (!requester || !requestedUser) {
      throw new Error("One or both users do not exist.");
    }

    // Check if a friendship request already exists
    const existingRequest = await prisma.friendshipRequest.findFirst({
      where: {
        requesterId,
        requestedUserId,
      },
    });

    if (existingRequest) {
      throw new Error("Friendship request already exists.");
    }

    await sendNotification(
      requestedUserId,
      `${requester.userName} pakvietė draugauti!`,
      NotificationTypes.FRIEND_REQUEST,
      requesterId,
    );

    // Create the friendship request
    return prisma.friendshipRequest.create({
      data: {
        requester: { connect: { id: requesterId } },
        requestedUser: { connect: { id: requestedUserId } },
        status: "PENDING",
      },
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating friendship request:", error);
    throw new Error("Failed to create friendship request.");
  }
}

// TO SHOW "REJECT INVITE" BUTTON REQUESTEER SIDE
export async function checkPendingStatusRequesteerSide(
  requesterId: string,
  requestedUserId: string,
) {
  const status = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requesterId,
      requestedUserId: requestedUserId,
      status: "PENDING",
    },
  });

  if (status) {
    return true;
  }
  return false;
}

// Delete the invite
export async function deleteFriendshipRequest(
  requesterId: string,
  requestedUserId: string,
) {
  const status = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requesterId,
      requestedUserId: requestedUserId,
      status: "PENDING",
    },
  });

  if (status) {
    return await prisma.friendshipRequest.deleteMany({
      where: {
        requesterId: requesterId,
        requestedUserId: requestedUserId,
      },
    });
  }
  return false;
}

// Reject the invite
export async function rejectFriendshipRequest(
  requesterId: string,
  requestedUserId: string,
) {
  const status = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requestedUserId,
      requestedUserId: requesterId,
      status: "PENDING",
    },
  });

  const requesterUser = await getUserById(requesterId);

  if (status) {
    await sendNotification(
      requestedUserId,
      `${requesterUser?.userName} atmetė kvietimą draugauti!`,
      NotificationTypes.FRIEND_DECLINED,
      requesterId,
    );
    return await prisma.friendshipRequest.deleteMany({
      where: {
        requesterId: requestedUserId,
        requestedUserId: requesterId,
      },
    });
  }
  return false;
}

// Remove from friends
export async function deleteFromFriends(
  requesterId: string,
  requestedUserId: string,
) {
  const status1 = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requesterId,
      requestedUserId: requestedUserId,
      status: "ACCEPTED",
    },
  });
  const status2 = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requestedUserId,
      requestedUserId: requesterId,
      status: "ACCEPTED",
    },
  });

  const requester = await getUserById(requesterId);

  await sendNotification(
    requestedUserId,
    `${requester?.userName} išmetė jus iš draugų`,
    NotificationTypes.FRIEND_REMOVE,
    requesterId,
  );

  if (status1) {
    return await prisma.friendshipRequest.deleteMany({
      where: {
        requesterId: requesterId,
        requestedUserId: requestedUserId,
      },
    });
  }

  if (status2) {
    return await prisma.friendshipRequest.deleteMany({
      where: {
        requesterId: requestedUserId,
        requestedUserId: requesterId,
      },
    });
  }
  return false;
}

// TO SHOW "REJECT INVITE, ACCEPT INVITE" BUTTON REQUESTED SIDE
export async function checkPendingStatusRequestedSide(
  requesterId: string,
  requestedUserId: string,
) {
  const status = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requestedUserId,
      requestedUserId: requesterId,
      status: "PENDING",
    },
  });

  if (status) {
    return true;
  }
  return false;
}

// TO SHOW "REMOVE FROM FRIENDS" BUTTON BOTH SIDES
export async function checkCurrentlyFriends(
  requesterId: string,
  requestedUserId: string,
) {
  const status1 = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requesterId,
      requestedUserId: requestedUserId,
      status: "ACCEPTED",
    },
  });

  const status2 = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requestedUserId,
      requestedUserId: requesterId,
      status: "ACCEPTED",
    },
  });

  if (status1 || status2) {
    return true;
  }
  return false;
}

export async function acceptFriendshipRequest(
  requesterId: string,
  requestedUserId: string,
) {
  const requesterUser = await getUserById(requesterId);

  const status = await prisma.friendshipRequest.findFirst({
    where: {
      requesterId: requestedUserId,
      requestedUserId: requesterId,
      status: "PENDING",
    },
  });
  if (status) {
    await prisma.friendshipRequest.update({
      where: {
        id: status.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });
    await sendNotification(
      requestedUserId,
      `${requesterUser?.userName} priėmė jūsų kvietimą draugauti`,
      NotificationTypes.FRIEND_ACCEPTED,
      requesterId,
    );
    return true; // Return true when the request is successfully accepted
  }
  return false; // Return false if no pending request is found
}
