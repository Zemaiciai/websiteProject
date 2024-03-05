import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { requireUser } from "~/session.server";

import ProfilePageEditDropBox from "./profilePageComponents/profilePageEditDropBox";
import UserInfo from "./profilePageComponents/userInformation";
import UserRatingAndOther from "./profilePageComponents/userRatingAndButtons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

export default function ProfileCard() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="profileCardDiv w-full h-full static">
      <div className="backGroundPhoto w-full h-[285px] bg-gradient-to-r from-sky-300 to-zinc-600 shadow-xl"></div>
      <div className="infoDiv w-full h-[200px] flex place-items-center space-x-20">
        <UserInfo />
        <UserRatingAndOther />
        <ProfilePageEditDropBox />
      </div>
      
    </div>
  );
}
