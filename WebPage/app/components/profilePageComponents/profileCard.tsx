import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUser } from "~/session.server";

import ProfilePageEditDropBox from "./profilePageEditDropBox";
import ProfilePageTabs from "./profilePageTabs";
import UserInfo from "./userInfo";
import UserRatingAndOther from "./userRatingAndButtons";
import { User } from "@prisma/client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

interface ProfileCardProps {
  user: any;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="profileCardDiv w-full h-full static">
      <div className="backGroundPhoto w-full h-[285px] bg-gradient-to-r from-sky-300 to-zinc-600 shadow-xl"></div>
      <div className="infoDiv w-full h-[200px] flex space-x-20">
        <UserInfo user={user} />
        <UserRatingAndOther />
      </div>
    </div>
  );
}
