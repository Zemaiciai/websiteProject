import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import Header from "~/components/common/header/header";
import ProfilePageTabs from "~/components/profilePageComponents/profilePageTabs";
import { useUser } from "~/utils";

import ProfileCard from "../components/profilePageComponents/profileCard";
import { redirect, useLoaderData } from "@remix-run/react";
import { User, getUserById } from "~/models/user.server";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import { useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import { requireUser } from "~/session.server";
import {
  acceptFriendshipRequest,
  checkCurrentlyFriends,
  checkPendingStatusRequestedSide,
  checkPendingStatusRequesteerSide,
  createFriendshipRequest,
  deleteFriendshipRequest,
  deleteFromFriends,
  rejectFriendshipRequest,
} from "~/models/friendshipRequest.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
export const meta: MetaFunction = () => [
  { title: "Profilio peržiūra - Žemaičiai" },
];

interface LoaderData {
  user: User;
  checkPendingStatusRequesteer: boolean;
  checkPendingStatusRequested: boolean;
  CurrentlyFriends: boolean;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = request.url;
  const parts = url.split("/");
  const user2 = await requireUser(request);
  const userProfileId = parts[parts.length - 1];

  const checkPendingStatusRequesteer = await checkPendingStatusRequesteerSide(
    user2.id,
    userProfileId,
  );

  const checkPendingStatusRequested = await checkPendingStatusRequestedSide(
    user2.id,
    userProfileId,
  );

  const CurrentlyFriends = await checkCurrentlyFriends(user2.id, userProfileId);

  return typedjson({
    user: await getUserById(userProfileId),
    requesteerStatus: checkPendingStatusRequesteer,
    requestedStatus: checkPendingStatusRequested,
    currenltyFriends: CurrentlyFriends,
  });
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

  if (formid === "cancelInvite") {
    const whoSentRequest = formData.get("whoSentInvite");
    const whoGotRequest = formData.get("whoGotInvite");
    deleteFriendshipRequest(whoSentRequest, whoGotRequest);
    return null;
  }

  if (formid === "acceptInvite") {
    const whoSentRequest = formData.get("whoSentInvite");
    const whoGotRequest = formData.get("whoGotInvite");
    acceptFriendshipRequest(whoSentRequest, whoGotRequest);
    return null;
  }

  if (formid === "rejectInvite") {
    const whoSentRequest = formData.get("whoSentInvite");
    const whoGotRequest = formData.get("whoGotInvite");
    rejectFriendshipRequest(whoSentRequest, whoGotRequest);
    return null;
  }

  if (formid === "removeFromFriends") {
    const whoSentRequest = formData.get("whoSentInvite");
    const whoGotRequest = formData.get("whoGotInvite");
    deleteFromFriends(whoSentRequest, whoGotRequest);
    return null;
  }
  return;
};

export default function NoteDetailsPage() {
  const OGuser = useUser();
  const data = useTypedLoaderData<typeof loader>();

  const [linkClicked, setLinkClicked] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="main-div">
      <NavBarHeader
        title={`${linkClicked ? "Profilio puslapis" : "Profilio puslapis"}`}
      />
      <div className="profilePageDiv">
        <ProfileCard
          user={data.user}
          checkPendingStatusRequesteer={data.requesteerStatus}
          checkPendingStatusRequested={data.requestedStatus}
          CurrentlyFriends={data.currenltyFriends}
        />
        <ProfilePageTabs user={data.user} />
      </div>
    </div>
  );
}
