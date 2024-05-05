import { prisma } from "~/db.server";
import { getUserById } from "./user.server";

export async function createQuestionerAnswers(
  userId: string,
  answers: string[],
) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return prisma.questionerAnswers.create({
    data: {
      userid: userId,
      answers: answers,
    },
  });
}

export async function getUserQuestionerAnswers(id: string) {
  return prisma.questionerAnswers.findFirst({
    where: {
      userid: id,
    },
  });
}
