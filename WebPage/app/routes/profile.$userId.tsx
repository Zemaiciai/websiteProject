import type { LoaderFunctionArgs } from "@remix-run/node";

import Header from "~/components/common/header/header";
import ProfilePageTabs from "~/components/profilePageComponents/profilePageTabs";
import { useUser } from "~/utils";

import ProfileCard from "../components/profilePageComponents/profileCard";
import { useLoaderData } from "@remix-run/react";
import { User, getUserById } from "~/models/user.server";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import { useState } from "react";

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<User | null> => {
  const url = request.url;
  const parts = url.split("/");
  const userProfileId = parts[parts.length - 1];
  const user = await getUserById(userProfileId);
  return user;
};

export default function NoteDetailsPage() {
  const OGuser = useUser();
  const user = useLoaderData<typeof loader>();
  const [linkClicked, setLinkClicked] = useState(false);
  return (
    <div className="main-div">
      <NavBarHeader
        title={`${linkClicked ? "Profilio puslapis" : "Profilio puslapis"}`}
      />
      <div className="profilePageDiv">
        <ProfileCard user={user} />
        <ProfilePageTabs user={user} />
      </div>
    </div>
  );
}
