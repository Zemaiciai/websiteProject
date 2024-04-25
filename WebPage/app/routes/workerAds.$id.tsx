import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  acceptInvite,
  cancelInvite,
  invitingUserToGroup,
  leaveGroup,
} from "~/models/groups.server";
import { getUserById } from "~/models/user.server";
import { getAddByID } from "~/models/workerAds.server";
import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [
  { title: "Reklamos peržiūra - Žemaičiai" },
];

export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formid = formData.get("form-id");

  if (formid === "userInvite") {
    const groupName = formData.get("group-name");
    const inviteUserName = formData.get("inviteUserName");
    invitingUserToGroup(groupName, inviteUserName);
    return null;
  }
  if (formid === "acceptInvite") {
    const groupID = formData.get("group-name");
    const inviteUserName = formData.get("user");
    acceptInvite(groupID, inviteUserName);
  }
  if (formid === "declineInvite") {
    const groupID = formData.get("group-name");
    const inviteUserName = formData.get("user");
    cancelInvite(groupID, inviteUserName);
  }
  if (formid === "leaveGroup") {
    const groupID = formData.get("group-name");
    const userName = formData.get("user");
    leaveGroup(groupID, userName);
  }

  return null;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userUsingRN = await requireUser(request);

  const url = request.url;
  const parts = url.split("/");
  const userProfileId = parts[parts.length - 1];

  console.log("Calling getAddByID with addId:", userProfileId);
  const getGroup = await getAddByID(userProfileId);

  const getAddOwner = await getUserById(userProfileId);

  return json({ userUsingRN, getGroup, getAddOwner });
};

const GroupDetailPage = () => {
  const { addId } = useParams();
  const { userUsingRN, getGroup, getAddOwner } = useLoaderData<typeof loader>();
  const [activeTabUsers, setActiveTabUsers] = useState("mainPage");
  const handleTabClickUser = (tab: string) => {
    setActiveTabUsers(tab);
  };
  // const userIsInvited = groupUsers.some(
  //   (user) => user.id === userUsingRN.id && user.role === GroupsRoles.INVITED,
  // );
  // const userHasPermissionsToGroupEditing = groupUsers.some(
  //   (user) =>
  //     user.id === userUsingRN.id &&
  //     (user.role === GroupsRoles.MODERATOR || user.role === GroupsRoles.OWNER),
  // );

  // const userHasPermissionsToLeave = groupUsers.some(
  //   (user) =>
  //     user.id === userUsingRN.id &&
  //     (user.role === GroupsRoles.MEMBER || user.role === GroupsRoles.MODERATOR),
  // );

  // const abilityToViewGroupAsMember = groupUsers.some(
  //   (user) =>
  //     user.id === userUsingRN.id &&
  //     (user.role === GroupsRoles.MEMBER ||
  //       user.role === GroupsRoles.MODERATOR ||
  //       user.role === GroupsRoles.OWNER),
  // );

  // const OwnerPermissions = groupUsers.some(
  //   (user) => user.id === userUsingRN.id && user.role === GroupsRoles.OWNER,
  // );
  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        <ul className="flex flex-wrap -mb-px border-b border-gray-200 pb-3">
          <div>
            <h1 className="font-bold text-2xl pt-4 pl-3">
              Peržiūrite grupę kurios pavadinimas: {getGroup?.adsName}
            </h1>
          </div>
        </ul>
        {activeTabUsers === "mainPage" ? (
          <>
            <div>
              <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap">
                Grupės aprašymas:
              </h1>
              <h1 className=" text-1xl pt-1 pl-3 text-wrap">
                {getGroup?.adsDescription}
              </h1>
            </div>
          </>
        ) : null}

        {activeTabUsers === "inviteMember" ? (
          <>
            <div>
              <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap mb-5">
                Nario pakvietimas:
              </h1>
              <Form method="post">
                <div className="flex flex-wrap mb-4">
                  <div className="w-full px-10">
                    <div className="flex flex-col">
                      <div className="relative">
                        <input
                          name="form-id"
                          hidden
                          defaultValue="userInvite"
                        />
                        <input name="group-name" hidden defaultValue={addId} />
                        <input
                          id="inviteUserName"
                          name="inviteUserName"
                          type="text"
                          autoComplete="on"
                          aria-describedby="email-error"
                          className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none"
                          placeholder="Vartotojo vardas"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Pakviesti!
                </button>
              </Form>
            </div>
          </>
        ) : null}
      </div>

      <div className="p-6 bg-custom-200 text-medium mt-3 mr-3 ">
        <div className="flex justify-center pb-2">
          <button
            className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
              activeTabUsers === "mainPage"
                ? "text-white  py-2 bg-custom-900  border-black "
                : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
            } w-full`}
            onClick={() => handleTabClickUser("mainPage")}
          >
            Pagrindinis
          </button>
        </div>
        <div className="flex justify-center pb-2">
          <button
            className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
              activeTabUsers === "viewUsers"
                ? "text-white  py-2 bg-custom-900  border-black "
                : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
            } w-full`}
            onClick={() => handleTabClickUser("viewUsers")}
          >
            Peržiūrėti narius
          </button>
        </div>
      </div>
    </>
  );
};

export default GroupDetailPage;
