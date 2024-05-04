import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import Header from "~/components/common/header/header";
import ProfilePageTabs from "~/components/profilePageComponents/profilePageTabs";
import { useUser } from "~/utils";

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
import { typedjson } from "remix-typedjson";
import {
  createSocialMedia,
  getSocialMediaByUserId,
  updateSocialMedia,
} from "~/models/socialMedia.server";
import { socialMedia } from "@prisma/client";
export const meta: MetaFunction = () => [
  { title: "Profilio peržiūra - Žemaičiai" },
];

interface LoaderData {
  user: User;
  checkPendingStatusRequesteer: boolean;
  checkPendingStatusRequested: boolean;
  CurrentlyFriends: boolean;
  socialMediaLinks: socialMedia | null;
}

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<LoaderData | null> => {
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

  const user = await getUserById(userProfileId);

  const socialMediaLinks = await getSocialMediaByUserId(userProfileId);

  return user
    ? {
        user,
        checkPendingStatusRequesteer,
        checkPendingStatusRequested,
        CurrentlyFriends,
        socialMediaLinks,
      }
    : null;
};
interface Errors {
  fbLinkError?: string;
  igLinkError?: string;
  twLinkError?: string;
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
    //TODO IKI GALO DAMUST VALIDATIONIUS, PADARYT KAD NEREAGUOTU JEI NEIVEDE NIEKO, PERSIUST ERRORUS I KITA FAILA
    //VALIDATION

    const user = formData.get("userid");
    const socialmed = await getSocialMediaByUserId(user);
    if (socialmed) {
      updateSocialMedia(socialmed.id, fbLink, igLink, twLink);
    } else {
      createSocialMedia(String(fbLink), String(igLink), String(twLink), user);
    }
    return null;
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
  const OGuser = useUser();
  const {
    user,
    checkPendingStatusRequesteer,
    checkPendingStatusRequested,
    CurrentlyFriends,
    socialMediaLinks,
  } = useLoaderData<LoaderData>();

  const [linkClicked, setLinkClicked] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const errorData = useActionData<Errors>();
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
        <ProfileCard
          user={user}
          checkPendingStatusRequesteer={checkPendingStatusRequesteer}
          checkPendingStatusRequested={checkPendingStatusRequested}
          CurrentlyFriends={CurrentlyFriends}
          socialMediaLinks={socialMediaLinks}
        />
        <ProfilePageTabs user={user} errorData={errorData} />
      </div>
    </div>
  );
}
