// groups.$groupId.tsx
import { GroupsRoles } from "@prisma/client";
import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { group } from "console";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { prisma } from "~/db.server";
import { getMoneyLogsByGroupId } from "~/models/groupBalanceLog.server";
import {
  acceptInvite,
  cancelInvite,
  checkIfUserIsInTheGroup,
  deleteGroup,
  getAllGroupUsers,
  getGroupByName,
  getUserRoleInGroup,
  groupInformationChange,
  groupMemberRoleChange,
  invitingUserToGroup,
  leaveGroup,
  removeUserFromGroup,
  sendMoneyToUser,
} from "~/models/groups.server";
import { getUserByEmail } from "~/models/user.server";
import { requireUser } from "~/session.server";
import { validateCreateGroup } from "~/utils";
export const meta: MetaFunction = () => [
  { title: "Grupės peržiūra - Žemaičiai" },
];
interface Errors {
  ivitingUser?: string;
  removeUser?: string;
  roleChangeUser?: string;
  roleChangeRole?: string;
  sendMoneyUser?: string;
  sendMoneyBalance?: string;
}
interface ChangeSettingsErrors {
  groupName?: string;
  groupShortDesc?: string;
  groupDescription?: string;
}
export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formid = formData.get("form-id");
  const errors: Errors = {};
  const changeSettingsErrors: ChangeSettingsErrors = {};
  if (formid === "userInvite") {
    const groupName = formData.get("group-name");
    const groupID = formData.get("group-id");
    const inviteUserEmail = formData.get("inviteUserEmail");
    const user = await getUserByEmail(inviteUserEmail);
    if (typeof inviteUserEmail !== "string" || inviteUserEmail === "") {
      errors.ivitingUser = "El. pašto adresas privalomas";
    } else if (inviteUserEmail.length < 3 || !inviteUserEmail.includes("@")) {
      errors.ivitingUser = "El. pašto adresas netinkamas";
    } else if (!(await getUserByEmail(inviteUserEmail))) {
      errors.ivitingUser = "Vartotojas su tokiu el. paštu neegzistuoja";
    } else if (await checkIfUserIsInTheGroup(groupID, String(user?.id))) {
      errors.ivitingUser = "Vartotojas jau yra grupeje";
    }
    if (errors.ivitingUser) {
      return errors;
    }
    invitingUserToGroup(groupName, inviteUserEmail);
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
    const check = await cancelInvite(groupID, inviteUserName);
    if (check) {
      return redirect("/groups");
    }
  }
  if (formid === "leaveGroup") {
    const groupID = formData.get("group-name");
    const userName = formData.get("user");
    const check = await leaveGroup(groupID, userName);
    if (check) {
      return redirect("/groups");
    }
  }
  if (formid === "userRoleChange") {
    const groupName = formData.get("group-name");
    const groupId = formData.get("group-id");
    const userEmailRoleChange = formData.get("userEmailRoleChange");
    const roleToChange = formData.get("roleToChange");
    const user = await getUserByEmail(userEmailRoleChange);
    if (!(await checkIfUserIsInTheGroup(groupId, String(user?.id)))) {
      errors.roleChangeUser = "Toks vartotojas grupeje neegzsituoja";
    } else if (
      (await getUserRoleInGroup(groupId, String(user?.id))) === "OWNER"
    ) {
      errors.roleChangeUser = "Savininkui role keisti negalima";
    }
    if (roleToChange === "holder") {
      errors.roleChangeRole = "Privaloma pasirinkti rolę";
    }
    if (errors.roleChangeRole || errors.roleChangeUser) {
      return errors;
    }
    groupMemberRoleChange(groupName, userEmailRoleChange, roleToChange);
  }
  if (formid === "changeSettings") {
    const groupID = formData.get("group-name");
    const groupNameChange = formData.get("groupNameChange");
    const groupShortDescriptionChange = formData.get(
      "groupShortDescriptionChange",
    );
    const groupFullDescriptionChange = formData.get(
      "groupFullDescriptionChange",
    );
    const validationErrors = await validateCreateGroup(
      groupNameChange,
      groupShortDescriptionChange,
      groupFullDescriptionChange,
      changeSettingsErrors,
      true,
    );

    if (validationErrors !== null) {
      return changeSettingsErrors;
    }
    const check = await groupInformationChange(
      groupID,
      groupNameChange,
      groupShortDescriptionChange,
      groupFullDescriptionChange,
    );

    if (check) {
      return redirect("/groups");
    }
  }
  if (formid === "userRemove") {
    const groupName = formData.get("group-name");
    const groupId = formData.get("group-id");
    const removeUserEmail = formData.get("removeUserEmail");
    const whoMadeRequestId = formData.get("whoMadeRequest");
    const user = await getUserByEmail(removeUserEmail);
    if (!(await checkIfUserIsInTheGroup(groupId, String(user?.id)))) {
      errors.removeUser = "Toks vartotojas grupeje neegzistuoja";
    }
    if (errors.removeUser) {
      return errors;
    }
    const check = await removeUserFromGroup(
      groupName,
      removeUserEmail,
      whoMadeRequestId,
    );
  }
  if (formid === "deleteGroup") {
    const groupID = formData.get("group-name");
    const whoMadeRequestId = formData.get("user");
    const check = await deleteGroup(groupID, whoMadeRequestId);
    if (check) {
      return redirect("/groups");
    }
  }

  if (formid === "sendingMoney") {
    const groupName = formData.get("group-name");
    const groupId = formData.get("group-id");
    const groupBalance = formData.get("group-balance");
    const whoMadeRequestID = formData.get("whoMadeRequestID");
    const userEmailMoneySend = formData.get("userEmailMoneySend");
    const moneyAmount = formData.get("moneyAmount");
    const user = await getUserByEmail(userEmailMoneySend);
    if (!(await checkIfUserIsInTheGroup(groupId, String(user?.id)))) {
      errors.sendMoneyUser = "Toks vartotojas grupeje neegzistuoja";
    }
    if (moneyAmount > groupBalance) {
      errors.sendMoneyBalance = "Grupes balanse nėra tiek pinigų";
    } else if (moneyAmount.length <= 0) {
      errors.sendMoneyBalance = "Privaloma įvesti sumą";
    }
    if (errors.sendMoneyBalance || errors.sendMoneyUser) {
      return errors;
    }
    const check = await sendMoneyToUser(
      groupName,
      whoMadeRequestID,
      userEmailMoneySend,
      moneyAmount,
    );
  }
  return null;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { groupId } = params;
  const userUsingRN = await requireUser(request);
  if (!groupId) {
    throw new Error("Group ID is missing");
  }
  const groupInfo = await getGroupByName(groupId);
  const groupUsers = await getAllGroupUsers(groupId);

  const balanceLogs = await getMoneyLogsByGroupId(String(groupInfo?.id));
  return json({ groupInfo, groupUsers, userUsingRN, balanceLogs });
};

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const { groupInfo, groupUsers, userUsingRN, balanceLogs } =
    useLoaderData<typeof loader>();
  const [activeTabUsers, setActiveTabUsers] = useState("mainPage");
  const handleTabClickUser = (tab: string) => {
    setActiveTabUsers(tab);
  };
  const userIsInvited = groupUsers.some(
    (user) => user.id === userUsingRN.id && user.role === GroupsRoles.INVITED,
  );
  const userHasPermissionsToGroupEditing = groupUsers.some(
    (user) =>
      user.id === userUsingRN.id &&
      (user.role === GroupsRoles.MODERATOR || user.role === GroupsRoles.OWNER),
  );

  const userHasPermissionsToLeave = groupUsers.some(
    (user) =>
      user.id === userUsingRN.id &&
      (user.role === GroupsRoles.MEMBER || user.role === GroupsRoles.MODERATOR),
  );

  const abilityToViewGroupAsMember = groupUsers.some(
    (user) =>
      user.id === userUsingRN.id &&
      (user.role === GroupsRoles.MEMBER ||
        user.role === GroupsRoles.MODERATOR ||
        user.role === GroupsRoles.OWNER),
  );

  const OwnerPermissions = groupUsers.some(
    (user) => user.id === userUsingRN.id && user.role === GroupsRoles.OWNER,
  );

  //Used for group deletion
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteClick = () => {
    setShowPopup(true);
  };

  const errorData = useActionData<Errors>();
  const changeSettingsErrorData = useActionData<ChangeSettingsErrors>();
  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        <ul className="flex flex-wrap -mb-px border-b border-gray-200 pb-3">
          <div>
            <h1 className="font-bold text-2xl pt-4 pl-3">
              Peržiūrite grupę kurios pavadinimas: {groupId}
            </h1>
          </div>
        </ul>
        {activeTabUsers === "mainPage" ? (
          <>
            <div>
              <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap">
                Grupės aprašymas:
              </h1>
              {/* <h1 className=" text-1xl pt-1 pl-3 text-wrap">
                {groupInfo?.groupFullDescription}
              </h1> */}
              <textarea
                className="text-1xl pt-1 pl-3 text-wrap break-words w-full h-[250px] resize-none"
                readOnly
              >
                {groupInfo?.groupFullDescription}
              </textarea>
            </div>
          </>
        ) : null}

        {activeTabUsers === "viewUsers" ? (
          <div className="pt-5 flex flex-wrap justify-center">
            {groupUsers.map((user) => (
              <div
                key={user.id}
                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mx-2 mb-4"
              >
                <div className="flex justify-end px-4 pt-4"></div>
                <div className="flex flex-col items-center pb-10">
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src="data:image/png;base64,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"
                    alt={`${user.firstName} ${user.lastName}'s profile`}
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.role === GroupsRoles.OWNER
                      ? "Owner"
                      : user.role === GroupsRoles.MODERATOR
                        ? "Moderator"
                        : user.role === GroupsRoles.MEMBER
                          ? "Member"
                          : user.role === GroupsRoles.INVITED
                            ? "Invited"
                            : "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {activeTabUsers === "inviteMember" ? (
          <>
            <div className="pl-3">
              <h1 className="font-bold text-1xl pt-4 text-wrap mb-5">
                Nario pakvietimas:
              </h1>
              <Form method="post">
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <input name="form-id" hidden defaultValue="userInvite" />
                    <input name="group-name" hidden defaultValue={groupId} />
                    <input
                      name="group-id"
                      hidden
                      defaultValue={groupInfo?.id}
                    />
                    <input
                      id="inviteUserEmail"
                      name="inviteUserEmail"
                      type="text"
                      autoComplete="on"
                      aria-describedby="email-error"
                      className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none"
                      placeholder="Vartotojo el. paštas"
                    />
                    {errorData?.ivitingUser ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.ivitingUser}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Pakviesti!
                </button>
              </Form>
            </div>
          </>
        ) : null}

        {activeTabUsers === "viewBalance" ? (
          <>
            <div className="w-full  bg-white border border-gray-200 rounded-lg shadow mt-5">
              <div className="flex flex-col items-center pb-10">
                <h1 className="mb-1 text-2xl font-medium text-gray-900 pt-5">
                  Balansas
                </h1>
                <span className="text-5xl text-green-500">
                  {groupInfo?.balance}€
                </span>
              </div>
            </div>
            <div className="mt-5 text-left">
              <h1 className="font-bold text-2xl">Balanso pokyčiai:</h1>
            </div>
            <div>
              <div className="flex justify-between pb-5"></div>
              <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="p-4">
                        Pervedimą atliko
                      </th>
                      <th scope="col" className="p-4">
                        Balanso pokyčio aprašymas
                      </th>
                      <th scope="col" className="p-4">
                        Balansas pasikeitė iš
                      </th>
                      <th scope="col" className="p-4">
                        Balansas pasikeitė į
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through all balance logs and render table rows */}
                    {balanceLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="bg-white border-b  hover:bg-gray-50 "
                      >
                        <td className="px-6 py-4">{log.whoDidChanges}</td>
                        <td className="px-6 py-4">{log.description}</td>
                        <td className="px-6 py-4">{log.balanceFrom}</td>
                        <td className="px-6 py-4">{log.balanceTo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}

        {activeTabUsers === "sendMoney" ? (
          <>
            <div className="flex flex-col items-center">
              {" "}
              {/* Center the content vertically */}
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow mt-5">
                <div className="flex flex-col items-center pb-10">
                  <h5 className="mb-1 text-2xl font-medium text-gray-900 pt-5">
                    Balansas
                  </h5>
                  <span className="text-5xl text-green-500">
                    {groupInfo?.balance}€
                  </span>
                </div>
              </div>
            </div>
            <div className="pl-3">
              <h1 className="font-bold text-1xl pt-4 text-wrap mb-5">
                Pinigų pervedimas:
              </h1>
              <Form method="post">
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <input name="form-id" hidden defaultValue="sendingMoney" />
                    <input name="group-name" hidden defaultValue={groupId} />
                    <input
                      name="group-id"
                      hidden
                      defaultValue={groupInfo?.id}
                    />
                    <input
                      name="group-balance"
                      hidden
                      defaultValue={groupInfo?.balance}
                    />
                    <input
                      name="whoMadeRequestID"
                      hidden
                      defaultValue={userUsingRN.id}
                    />
                    <input
                      id="userEmailMoneySend"
                      name="userEmailMoneySend"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      placeholder="Vartotojo kuriame atliekate pavedima el. paštas"
                    />
                    {errorData?.sendMoneyUser ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.sendMoneyUser}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <input
                      id="moneyAmount"
                      name="moneyAmount"
                      type="number"
                      step="0.01" // Allow increments of 0.01
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      placeholder="Kiek norite pervesti?"
                      min="0" // Optional: specify minimum value
                      max="9999999.99" // Optional: specify maximum value
                      pattern="^\d{1,10}(\.\d{1,2})?$" // Optional: client-side regex pattern validation
                    />
                    {errorData?.sendMoneyBalance ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.sendMoneyBalance}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Atlikti pervedimą!
                </button>
              </Form>
            </div>
          </>
        ) : null}

        {activeTabUsers === "changeRole" ? (
          <>
            <div className="pl-3">
              <h1 className="font-bold text-1xl pt-4 text-wrap mb-5">
                Grupes narių rolės keitimas:
              </h1>
              <Form method="post">
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <input
                      name="form-id"
                      hidden
                      defaultValue="userRoleChange"
                    />
                    <input name="group-name" hidden defaultValue={groupId} />
                    <input
                      name="group-id"
                      hidden
                      defaultValue={groupInfo?.id}
                    />
                    <input
                      id="userEmailRoleChange"
                      name="userEmailRoleChange"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      placeholder="Vartotojo el. paštas"
                    />
                    {errorData?.roleChangeUser ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.roleChangeUser}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <select
                      id="roleToChange"
                      name="roleToChange"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                    >
                      <option value="holder">Pasirinkti rolę</option>
                      <option value="member">Narys</option>
                      <option value="moderator">Moderatorius</option>
                      <option value="owner">Vadovas</option>
                    </select>
                    {errorData?.roleChangeRole ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.roleChangeRole}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Pakeisti rolę!
                </button>
              </Form>
            </div>
          </>
        ) : null}

        {activeTabUsers === "removeMember" ? (
          <>
            <div className="pl-3">
              <h1 className="font-bold text-1xl pt-4 text-wrap mb-5">
                Nario išmetimas:
              </h1>
              <Form method="post">
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <input name="form-id" hidden defaultValue="userRemove" />
                    <input name="group-name" hidden defaultValue={groupId} />
                    <input
                      name="group-id"
                      hidden
                      defaultValue={groupInfo?.id}
                    />
                    <input
                      name="whoMadeRequest"
                      hidden
                      defaultValue={userUsingRN.id}
                    />
                    <input
                      id="removeUserEmail"
                      name="removeUserEmail"
                      type="text"
                      autoComplete="on"
                      aria-describedby="email-error"
                      className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none"
                      placeholder="Vartotojo el. paštas"
                    />
                    {errorData?.removeUser ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.removeUser}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Išmesti!
                </button>
              </Form>
            </div>
          </>
        ) : null}

        {activeTabUsers === "changeSettings" ? (
          <>
            <div className="pl-3">
              <h1 className="font-bold text-1xl pt-4 text-wrap">
                Grupės informacijos keitimas:
              </h1>
              <Form method="post">
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <input
                      name="form-id"
                      hidden
                      defaultValue="changeSettings"
                    />
                    <input name="group-name" hidden defaultValue={groupId} />
                    <h1 className=" text-1xl pt-2 text-wrap mb-1">
                      Grupės pavadinimas:
                    </h1>
                    <input
                      id="groupNameChange"
                      name="groupNameChange"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={groupInfo?.groupName}
                    />
                    {changeSettingsErrorData?.groupName ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {changeSettingsErrorData.groupName}
                      </div>
                    ) : null}
                    <h1 className=" text-1xl pt-2 text-wrap mb-1">
                      Grupės apibūdinimas:
                    </h1>
                    <input
                      id="groupShortDescriptionChange"
                      name="groupShortDescriptionChange"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={groupInfo?.groupShortDescription}
                    />
                    {changeSettingsErrorData?.groupShortDesc ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {changeSettingsErrorData.groupShortDesc}
                      </div>
                    ) : null}
                  </div>

                  {/* New textarea field */}
                  <div className="w-full px-3">
                    <div className="flex flex-col">
                      <div className="relative">
                        <h1 className=" text-1xl pt-2 text-wrap mb-1">
                          Grupės aprašymas:
                        </h1>
                        <textarea
                          id="groupFullDescriptionChange"
                          name="groupFullDescriptionChange"
                          autoComplete="on"
                          className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black resize-none"
                          defaultValue={groupInfo?.groupFullDescription}
                          style={{ resize: "none" }} // Disable resizing
                          rows={7}
                        ></textarea>
                        {changeSettingsErrorData?.groupDescription ? (
                          <div
                            className="pt-1 font-bold text-red-500"
                            id="firstname-error"
                          >
                            {changeSettingsErrorData.groupDescription}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Atnaujinti grupės informacija!
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
        {userHasPermissionsToGroupEditing && (
          <>
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "changeSettings"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("changeSettings")}
              >
                Keisti informacija
              </button>
            </div>
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "inviteMember"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("inviteMember")}
              >
                Pakviesti vartotoją
              </button>
            </div>
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "removeMember"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("removeMember")}
              >
                Išmesti vartotoją
              </button>
            </div>
          </>
        )}
        {abilityToViewGroupAsMember && (
          <>
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "viewBalance"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("viewBalance")}
              >
                Peržiūrėti balansą
              </button>
            </div>
          </>
        )}

        {OwnerPermissions && (
          <>
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "changeRole"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("changeRole")}
              >
                Pakeisti rolę
              </button>
            </div>
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "sendMoney"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("sendMoney")}
              >
                Atlikti pervedimą
              </button>
            </div>
            <div className="flex justify-center pb-2">
              <button
                type="button" // Change type to "button" to prevent form submission
                onClick={handleDeleteClick}
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-11 rounded text-nowrap
            ? "bg-custom-900 border-black"
            : "bg-custom-800  transition duration-300 ease-in-out border-black"
          }`}
              >
                Ištrinti šią grupę
              </button>
            </div>
          </>
        )}

        {showPopup && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <p className="text-center">
                Ar tikrai norite ištrinti šią grupę?
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="mr-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out"
                >
                  Atšaukti
                </button>
                <Form method="post">
                  <input name="form-id" hidden defaultValue="deleteGroup" />
                  <input name="group-name" hidden defaultValue={groupId} />
                  <input name="user" hidden defaultValue={userUsingRN.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
                  >
                    Ištrinti šią grupę
                  </button>
                </Form>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center flex-col">
          {userHasPermissionsToLeave && (
            <>
              <Form method="post">
                <input name="form-id" hidden defaultValue="leaveGroup" />
                <input name="group-name" hidden defaultValue={groupId} />
                <input name="user" hidden defaultValue={userUsingRN.id} />
                <button
                  type="submit"
                  className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap`}
                >
                  Palikti grupę
                </button>
              </Form>
            </>
          )}

          {/* Render buttons only if the user is invited */}
          {userIsInvited && (
            <>
              <Form method="post">
                <input name="form-id" hidden defaultValue="acceptInvite" />
                <input name="group-name" hidden defaultValue={groupId} />
                <input name="user" hidden defaultValue={userUsingRN.id} />
                <button
                  type="submit"
                  className={`mb-2 w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap`}
                >
                  Priimti pakvietimą
                </button>
              </Form>

              <Form method="post">
                <input name="form-id" hidden defaultValue="declineInvite" />
                <input name="group-name" hidden defaultValue={groupId} />
                <input name="user" hidden defaultValue={userUsingRN.id} />
                <button
                  type="submit"
                  className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap`}
                >
                  Atmesti pakvietimą
                </button>
              </Form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupDetailPage;
