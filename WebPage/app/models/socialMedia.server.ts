import { prisma } from "~/db.server";
import { createCustomMessageLog } from "./adminLogs.server";

export async function createSocialMedia(
  fbLink: string,
  igLink: string,
  twLink: string,
  user: string,
) {
  return prisma.socialMedia.create({
    data: {
      facebookLink: fbLink,
      InstagramLink: igLink,
      TwitterLink: twLink,
      userid: user,
    },
  });
}

export async function getSocialMediaByUserId(userid: string) {
  return prisma.socialMedia.findFirst({ where: { userid } });
}
export async function updateSocialMedia(
  id: string,
  fbChange: string | undefined,
  igChange: string | undefined,
  twChange: string | undefined,
) {
  const socialMedia = await prisma.socialMedia.findFirst({ where: { id } });
  if (fbChange == null || fbChange == "") {
    fbChange = socialMedia?.facebookLink;
  }
  if (igChange == null || igChange == "") {
    igChange = socialMedia?.InstagramLink;
  }
  if (twChange == null || twChange == "") {
    twChange = socialMedia?.TwitterLink;
  }
  const changeInfo = await prisma.socialMedia.update({
    where: {
      id: id,
    },
    data: {
      facebookLink: fbChange,
      InstagramLink: igChange,
      TwitterLink: twChange,
    },
  });
}
