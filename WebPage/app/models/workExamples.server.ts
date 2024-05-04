import { prisma } from "~/db.server";
import { getUserById } from "./user.server";

export async function createWorkExamples(
  userId: string,
  videoOne: string,
  videoTwo: string,
  videoThird: string,
  videoFour: string,
  videoFive: string,
) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isValidYouTubeLink = (link: string): boolean => {
    // Regex pattern to match YouTube video IDs with optional query parameters
    const youtubePattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
    return youtubePattern.test(link);
  };

  const validVideoLinks = [
    videoOne,
    videoTwo,
    videoThird,
    videoFour,
    videoFive,
  ].filter((link) => link.trim() !== "" && isValidYouTubeLink(link));

  return prisma.workExamples.create({
    data: {
      userid: userId,
      examples: validVideoLinks,
    },
  });
}

export async function getUserWorkExamples(id: string) {
  return prisma.workExamples.findFirst({
    where: {
      userid: id,
    },
  });
}

export async function workExamplesUpdate(
  userId: string,
  videoOne: string,
  videoTwo: string,
  videoThird: string,
  videoFour: string,
  videoFive: string,
  exampleId: string,
) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const workExamples = await prisma.workExamples.findFirst({
    where: {
      userid: userId,
    },
  });
  const isValidYouTubeLink = (link: string): boolean => {
    // Regex pattern to match YouTube video IDs with optional query parameters
    const youtubePattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
    return youtubePattern.test(link);
  };

  const validVideoLinks = [
    videoOne,
    videoTwo,
    videoThird,
    videoFour,
    videoFive,
  ].filter((link) => link.trim() !== "" && isValidYouTubeLink(link));
  if (workExamples) {
    return prisma.workExamples.update({
      where: {
        id: exampleId,
        userid: userId,
      },
      data: {
        userid: userId,
        examples: validVideoLinks,
      },
    });
  }
  return null;
}

export async function deleteWorkExamples(id: string) {
  return prisma.workExamples.delete({
    where: {
      id: id,
    },
  });
}
