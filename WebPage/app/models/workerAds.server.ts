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

  if (customName !== "" && fullDescription !== "")
    if (true) {
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

export async function getAllWorkerAdds() {
  return prisma.workerAds.findMany();
}

export async function getAllWorkerAddsCreators() {
  try {
    // Fetch all worker ads
    const allWorkerAdds = await prisma.workerAds.findMany();

    const creators: string[] = [];

    // Iterate through each worker ad and find the creator's username
    for (const workerAdd of allWorkerAdds) {
      // Get the creator's username
      const creator = await prisma.user.findUnique({
        where: {
          id: workerAdd.userid,
        },
        select: {
          userName: true,
        },
      });

      // If creator is found, push the username to the creators array
      if (creator) {
        creators.push(creator.userName);
      }
    }

    return creators;
  } catch (error) {
    console.error("Error fetching worker ad creators:", error);
    throw new Error("Failed to fetch worker ad creators");
  }
}

export async function getAllMyAdds(userWhoUses: string) {
  return prisma.workerAds.findMany({
    where: {
      userid: userWhoUses,
    },
  });
}

export async function getAddByID(addId: string) {
  console.log(addId); //ITS RETURNING [object Object]
  return prisma.workerAds.findFirst({
    where: {
      id: addId,
    },
  });
}

export async function WorkerAdsUpdate(
  whoCreated: string,
  workerAddID: string,
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

  if (customName !== "" && fullDescription !== "")
    if (true) {
      const isValidYouTubeLink = (link: string): boolean => {
        // Regex pattern to match YouTube video IDs with optional query parameters
        const youtubePattern =
          /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
        return youtubePattern.test(link);
      };

      const validVideoLinks = [videoOne, videoTwo, videoThird].filter(
        (link) => link.trim() !== "" && isValidYouTubeLink(link),
      );

      return prisma.workerAds.update({
        where: {
          id: workerAddID,
          userid: whoCreated,
        },
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
