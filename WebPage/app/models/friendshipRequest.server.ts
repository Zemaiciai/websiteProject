import { prisma } from "~/db.server";

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
export async function acceptFriendshipRequest(requestId: string) {
  try {
    // Find the friendship request
    const request = await prisma.friendshipRequest.findUnique({
      where: { id: requestId },
      include: { requester: true, requestedUser: true },
    });

    if (!request) {
      throw new Error("Friendship request not found.");
    }

    // Update the status of the request to "ACCEPTED"
    await prisma.friendshipRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    return null;
  } catch (error) {
    // Handle errors
    console.error("Error accepting friendship request:", error);
    throw new Error("Failed to accept friendship request.");
  }
}
