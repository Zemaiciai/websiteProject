import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import Header from "~/components/common/header/header";
import ProfilePageTabs from "~/components/profilePageComponents/profilePageTabs";
import { useUser } from "~/utils";

import ProfileCard from "../components/profilePageComponents/profileCard";
import { useLoaderData } from "@remix-run/react";
import { User, getUserById } from "~/models/user.server";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import { useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import { requireUser } from "~/session.server";
import {
  checkCurrentlyFriends,
  checkPendingStatusRequestedSide,
  checkPendingStatusRequesteerSide,
  createFriendshipRequest,
} from "~/models/friendshipRequest.server";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<User | null> => {
  const url = request.url;
  const parts = url.split("/");
  const user2 = await requireUser(request);
  const userProfileId = parts[parts.length - 1];
  // TO SHOW "REJECT INVITE" BUTTON REQUESTEER SIDE
  const checkPendingStatusRequesteer = await checkPendingStatusRequesteerSide(
    user2.id,
    userProfileId,
  );
  // TO SHOW "REJECT INVITE, ACCEPT INVITE" BUTTON REQUESTED SIDE
  const checkPendingStatusRequested = await checkPendingStatusRequestedSide(
    user2.id,
    userProfileId,
  );
  // TO SHOW "REMOVE FROM FRIENDS" BUTTON BOTH SIDES
  const CurrentlyFriends = await checkCurrentlyFriends(user2.id, userProfileId);

  const user = await getUserById(userProfileId);

  return user;
};

export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formid = formData.get("form-id");

  if (formid === "sendInvite") {
    const whoSentRequest = formData.get("whoSentInvite");
    const whoGotRequest = formData.get("whoGotInvite");
    createFriendshipRequest(whoSentRequest, whoGotRequest);
    return null;
  }
  return;
};

export default function NoteDetailsPage() {
  const OGuser = useUser();
  const user = useLoaderData<typeof loader>();
  const [linkClicked, setLinkClicked] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="main-div">
      {/* <div className="navbar-container">
        <NavBar
          title={"Orders"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={activeTab}
          tabTitles={["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]}
        />
      </div> */}
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
