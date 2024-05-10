import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import ProfilePageTabs from "~/components/profilePageComponents/profilePageTabs";
import { useUser, validateCreateWorkExample } from "~/utils";

import ProfileCard from "../components/profilePageComponents/profileCard";
import { redirect, useActionData, useLoaderData } from "@remix-run/react";
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
import {
  createSocialMedia,
  getSocialMediaByUserId,
  updateSocialMedia,
} from "~/models/socialMedia.server";
import { socialMedia, workExamples } from "@prisma/client";
import {
  createWorkExamples,
  getUserWorkExamples,
  workExamplesUpdate,
} from "~/models/workExamples.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getOrdersByUserId } from "~/models/order.server";
import { gettingReviewList } from "~/models/userRatings.server";
export const meta: MetaFunction = () => [
  { title: "Profilio peržiūra - Žemaičiai" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = request.url;
  const parts = url.split("/");
  const user2 = await requireUser(request);
  const userProfileId = parts[parts.length - 1];
  const orders = await getOrdersByUserId(userProfileId);

  const completedOrders = orders?.filter(
    (order) =>
      order.orderStatus === "COMPLETED" || order.orderStatus === "PAYED",
  );
  let ordersCount = 0;
  if (Number(completedOrders?.length) > 0) {
    ordersCount = Number(completedOrders?.length);
  }

  const checkPendingStatusRequesteer = await checkPendingStatusRequesteerSide(
    user2.id,
    userProfileId,
  );

  const checkPendingStatusRequested = await checkPendingStatusRequestedSide(
    user2.id,
    userProfileId,
  );

  const CurrentlyFriends = await checkCurrentlyFriends(user2.id, userProfileId);

  const socialMediaLinks = await getSocialMediaByUserId(userProfileId);

  let listOfReviews = await gettingReviewList(userProfileId);
  listOfReviews.reverse(); // So the newest ones would be on top

  return typedjson({
    user: await getUserById(userProfileId),
    requesteerStatus: checkPendingStatusRequesteer,
    requestedStatus: checkPendingStatusRequested,
    currenltyFriends: CurrentlyFriends,
    socialMediaLinks: socialMediaLinks,
    workExamples: await getUserWorkExamples(userProfileId),
    ordersCount: ordersCount,
    listOfReviews: listOfReviews,
  });
};
interface Errors {
  fbLinkError?: string;
  igLinkError?: string;
  twLinkError?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  video4?: string;
  video5?: string;
}
export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const errors: Errors = {};
  const formid = formData.get("form-id");
  if (formid === "socialMedia") {
    const fbLinkRegex =
      /^(https?:\/\/)?(www\.)?facebook\.com\/(?:[a-zA-Z0-9._-]+\/?)?$/;
    const igLinkRegex =
      /^(https?:\/\/)?(www\.)?instagram\.com\/(?:[a-zA-Z0-9._-]+\/?)?$/;
    const twLinkRegex =
      /^(https?:\/\/)?(www\.)?twitter\.com\/(?:[a-zA-Z0-9._-]+\/?)?$/;
    const fbLinkt = fbLinkRegex.test(formData.get("fblink"));
    const igLinkt = igLinkRegex.test(formData.get("iglink"));
    const twLinkt = twLinkRegex.test(formData.get("twlink"));
    const fbLink = formData.get("fblink");
    const igLink = formData.get("iglink");
    const twLink = formData.get("twlink");
    //VALIDATION
    if (!fbLinkt && fbLink != "") {
      errors.fbLinkError = "Nuoroda neatitinka formato";
    }
    if (!igLinkt && igLink != "") {
      errors.igLinkError = "Nuoroda neatitinka formato";
    }
    if (!twLinkt && twLink != "") {
      errors.twLinkError = "Nuoroda neatitinka formato";
    }
    if (errors.fbLinkError || errors.igLinkError || errors.twLinkError) {
      return errors;
    }
    const user = formData.get("userid");
    const socialmed = await getSocialMediaByUserId(user);
    if (socialmed) {
      updateSocialMedia(socialmed.id, fbLink, igLink, twLink);
    } else {
      createSocialMedia(String(fbLink), String(igLink), String(twLink), user);
    }
    return null;
  }

  if (formid === "changeExample") {
    const video1 = formData.get("video1");
    const video2 = formData.get("video2");
    const video3 = formData.get("video3");
    const video4 = formData.get("video4");
    const video5 = formData.get("video5");
    const user = formData.get("userid");
    const validationErrors = await validateCreateWorkExample(
      video1,
      video2,
      video3,
      video4,
      video5,
      errors,
    );

    if (validationErrors !== null) {
      return errors;
    }
    const examples = await getUserWorkExamples(user);
    if (examples) {
      await workExamplesUpdate(
        user,
        video1,
        video2,
        video3,
        video4,
        video5,
        examples.id,
      );
    } else {
      await createWorkExamples(user, video1, video2, video3, video4, video5);
    }

    return redirect(`/profile/${user}`);
  }

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
  return null;
};

export default function NoteDetailsPage() {
  const data = useTypedLoaderData<typeof loader>();
  const errorData = useActionData<Errors>();
  return (
    <div className="main-div mb-3">
      <div className="profilePageDiv bg-white">
        <ProfileCard
          user={data.user}
          checkPendingStatusRequesteer={data.requesteerStatus}
          checkPendingStatusRequested={data.requestedStatus}
          CurrentlyFriends={data.currenltyFriends}
          socialMediaLinks={data.socialMediaLinks}
        />
        <ProfilePageTabs
          user={data.user}
          errorData={errorData}
          workExample={data.workExamples}
          socialMediaLinks={data.socialMediaLinks}
          orderCount={data.ordersCount}
          Reviews={data.listOfReviews}
        />
      </div>
    </div>
  );
}
