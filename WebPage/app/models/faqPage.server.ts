import { prisma } from "~/db.server";

export async function createFAQQuestion(
  questionName: string,
  questionDescription: string,
) {
  if (questionName === "" && questionDescription === "") {
    return null;
  } else {
    return prisma.faqPage.create({
      data: {
        questionName: questionName,
        questionAnswer: questionDescription,
      },
    });
  }
}

export async function deleteFAQQuestion(questionID: string) {
  const check = await prisma.faqPage.findUnique({
    where: {
      id: questionID,
    },
  });

  if (check) {
    return prisma.faqPage.delete({
      where: {
        id: questionID,
      },
    });
  }
}

export async function getFAQQuestions() {
  return prisma.faqPage.findMany();
}
