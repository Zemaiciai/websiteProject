import { prisma } from "~/db.server";

export async function createConversation(userId1: string, userId2: string) {
  const checkOneUser = await prisma.user.findFirst({
    where: {
      id: userId1,
    },
  });

  const checkTwoUser = await prisma.user.findFirst({
    where: {
      email: userId2,
    },
  });

  if (!checkOneUser) {
    return null;
  }
  if (!checkTwoUser) {
    return null;
  }

  // Check if a conversation already exists between the two users
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: userId1 } } },
        { participants: { some: { id: checkTwoUser.id } } },
      ],
    },
  });

  if (existingConversation) {
    // Conversation already exists, return its ID
    //return existingConversation.id;
    return null;
  }

  // Create a new conversation
  const newConversation = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: userId1 }, { id: checkTwoUser.id }],
      },
    },
  });

  return newConversation.id;
}

export async function getConversations(userId) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { id: userId },
      },
    },
    include: {
      participants: true, // Include all participant details
    },
  });

  if (conversations) {
    return conversations;
  }
  return null;
}
