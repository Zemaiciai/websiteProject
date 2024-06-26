import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";

import {
  getAllGroups,
  getAllGroupsAndOwners,
  getGroupByUserId,
  getGroupsOfUserOwners,
} from "~/models/groups.server";
import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [{ title: "Grupės - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  const userGroups = await getGroupByUserId(user.id);
  const userGroupsOwners = await getGroupsOfUserOwners(user.id);
  const allGroups = await getAllGroups();
  const allGGroupsOwners = await getAllGroupsAndOwners();
  return json({ userGroups, userGroupsOwners, allGroups, allGGroupsOwners });
};

export default function GroupsIndexPage() {
  const { userGroups, userGroupsOwners, allGroups, allGGroupsOwners } =
    useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("myGroups");
  const [searchQueryMyGroups, setSearchQueryMyGroups] = useState("");
  const [searchQueryAllGroups, setSearchQueryAllGroups] = useState("");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredGroupsMyGroups = userGroups.filter((group) =>
    group.groupName.toLowerCase().includes(searchQueryMyGroups.toLowerCase()),
  );

  const filteredGroupsAllGroups = allGroups.filter((group) =>
    group.groupName.toLowerCase().includes(searchQueryAllGroups.toLowerCase()),
  );

  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        {/* Adjusted width */}
        <ul className="flex flex-wrap -mb-px border-b border-gray-200">
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "myGroups"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("myGroups")}
            >
              Mano grupės
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "allGroups"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("allGroups")}
            >
              Visos grupės
            </button>
          </li>
        </ul>
        {activeTab === "myGroups" ? (
          <>
            {filteredGroupsMyGroups.length === 0 ? (
              <p className="mt-5">
                Jūs nepriklausote jokiai grupei, prisijunkite arba sukurkite!
              </p>
            ) : (
              <div>
                <div className="flex justify-between pb-5">
                  {/* Outlet or tab buttons */}
                  {/* Search input */}
                  <input
                    type="text"
                    placeholder="Ieškoti grupės pagal pavadinima"
                    value={searchQueryMyGroups}
                    onChange={(e) => setSearchQueryMyGroups(e.target.value)}
                    className="p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-800"
                    style={{ width: "80%" }} // Adjust the width as needed
                  />
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="p-4">
                          Grupės pavadinimas
                        </th>
                        <th scope="col" className="p-4">
                          Grupės apibūdinimas
                        </th>
                        <th scope="col" className="p-4">
                          Grupė priklauso
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through filtered groups and render table rows */}
                      {filteredGroupsMyGroups.map((group) => {
                        // Find the owner of the current group from userGroupsOwners
                        const ownerGroup = userGroupsOwners.find(
                          (owner) => owner.group.id === group.id,
                        );

                        return (
                          <tr
                            key={group.id}
                            className="bg-white border-b  hover:bg-gray-50 "
                          >
                            {/* Make each row clickable and redirect to a specific route */}
                            <td className="px-6 py-4 cursor-pointer">
                              <Link
                                to={"/groups/" + group.groupName}
                                className="font-medium text-gray-900  hover:underline"
                              >
                                {group.groupName}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              {group.groupShortDescription}
                            </td>
                            <td className="px-6 py-4">
                              {ownerGroup
                                ? ownerGroup.owner.user
                                  ? ownerGroup.owner.user.userName
                                  : "Unknown"
                                : "Unknown"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
        {activeTab === "allGroups" ? (
          <>
            <input
              type="text"
              placeholder="Ieškoti grupės pagal pavadinima"
              value={searchQueryAllGroups}
              onChange={(e) => setSearchQueryAllGroups(e.target.value)}
              className="p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-800"
              style={{ width: "80%" }} // Adjust the width as needed
            />
            {filteredGroupsAllGroups.length === 0 ? (
              <p className="mt-5">Nėra grupių</p>
            ) : (
              <div>
                <div className="flex justify-between pb-5"></div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="p-4">
                          Grupės pavadinimas
                        </th>
                        <th scope="col" className="p-4">
                          Grupės apibūdinimas
                        </th>
                        <th scope="col" className="p-4">
                          Grupė priklauso
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through all groups and render table rows */}
                      {filteredGroupsAllGroups.map((group) => {
                        // Find the owner of the current group from allGroupsOwners
                        const ownerGroup = allGGroupsOwners.find(
                          (owner) => owner.group.id === group.id,
                        );

                        return (
                          <tr
                            key={group.id}
                            className="bg-white border-b  hover:bg-gray-50 "
                          >
                            {/* Make each row clickable and redirect to a specific route */}
                            <td className="px-6 py-4 cursor-pointer">
                              <Link
                                to={"/groups/" + group.groupName}
                                className="font-medium text-gray-900  hover:underline"
                              >
                                {group.groupName}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              {group.groupShortDescription}
                            </td>
                            <td className="px-6 py-4">
                              {/* Display the owner's information if ownerGroup is found */}
                              {ownerGroup
                                ? ownerGroup.owner.user
                                  ? ownerGroup.owner.user.userName
                                  : "Unknown"
                                : "Unknown"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
      <div className="p-6 bg-custom-200 text-medium mt-3 mr-3 ">
        <div className="flex justify-center ">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Sukurti grupę
          </Link>
        </div>
      </div>
    </>
  );
}
