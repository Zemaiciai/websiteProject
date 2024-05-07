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

export async function getConversations(userId: string) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1 }, // Fetch the latest message for each conversation
      },
    });

    const conversationsWithUpdatedAt = conversations.map((conversation) => {
      const latestMessage = conversation.messages[0];
      const updatedAt = latestMessage
        ? latestMessage.createdAt
        : conversation.createdAt;

      return {
        ...conversation,
        updatedAt: updatedAt,
      };
    });

    return conversationsWithUpdatedAt;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
) {
  try {
    // Find the conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Determine the recipient ID
    const recipientId = conversation.participants.find(
      (participant) => participant.id !== senderId,
    )?.id;

    if (!recipientId) {
      throw new Error("Recipient not found");
    }

    // Create the new message
    const newMessage = await prisma.message.create({
      data: {
        text: content,
        senderId: senderId,
        recipientId: recipientId,
        conversationId: conversationId,
      },
    });

    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}

export async function getMessagesByConversationId(conversationId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const participantIds = conversation.participants.map(
      (participant) => participant.id,
    );

    return { messages, participantIds };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
}
