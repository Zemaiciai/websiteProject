import { prisma } from "~/db.server";
import { getUserById } from "./user.server";

export async function createWorkerAds(
  whoCreated: string,
  customName: string,
  fullDescription: string,
  videoOne: string,
  videoTwo: string,
  videoThird: string,
) {
  const user = await getUserById(whoCreated);
  if (!user) {
    throw new Error("User not found");
  }

  if (customName !== null && fullDescription !== null)
    if (await checkUserAdsLimit(whoCreated)) {
      const isValidYouTubeLink = (link: string): boolean => {
        // Regex pattern to match YouTube video IDs with optional query parameters
        const youtubePattern =
          /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
        return youtubePattern.test(link);
      };

      const validVideoLinks = [videoOne, videoTwo, videoThird].filter(
        (link) => link.trim() !== "" && isValidYouTubeLink(link),
      );

      return prisma.workerAds.create({
        data: {
          adsName: customName,
          adsDescription: fullDescription,
          userid: whoCreated,
          adsExamples: validVideoLinks,
        },
      });
    }
  return null;
}

export async function checkUserAdsLimit(userId: string): Promise<boolean> {
  // Query the WorkerAds table to count the number of ads created by the user
  const adsCount = await prisma.workerAds.count({
    where: {
      userid: userId,
    },
  });

  // Return true if the user has created less than two ads, false otherwise
  return adsCount < 2;
}
