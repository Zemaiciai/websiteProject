import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import ProfilePageTabs from "~/components/profilePageComponents/profilePageTabs";

import ProfileCard from "../components/profilePageComponents/profileCard";
import { getUserById } from "~/models/user.server";
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
  const data = useTypedLoaderData<typeof loader>();
  return (
    <div className="main-div">
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
