import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";

import {
  getAllGroups,
  getAllGroupsAndOwners,
  getGroupByUserId,
  getGroupsOfUserOwners,
} from "~/models/groups.server";
import {
  getAllWorkerAdds,
  getAllWorkerAddsCreators,
} from "~/models/workerAds.server";
import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [{ title: "Reklama - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  const allAdds = await getAllWorkerAdds();
  const allAddsCreators = await getAllWorkerAddsCreators();

  const userGroups = await getGroupByUserId(user.id);
  const userGroupsOwners = await getGroupsOfUserOwners(user.id);
  const allGroups = await getAllGroups();
  const allGGroupsOwners = await getAllGroupsAndOwners();
  return json({
    user,
    userGroups,
    userGroupsOwners,
    allAdds,
    allAddsCreators,
  });
};

export default function GroupsIndexPage() {
  const { user, userGroups, userGroupsOwners, allAdds, allAddsCreators } =
    useLoaderData<typeof loader>();

  const [searchQueryMyGroups, setSearchQueryMyGroups] = useState("");
  const [searchQueryAllGroups, setSearchQueryAllGroups] = useState("");

  const [activeTab, setActiveTab] = useState(
    user.role === "Darbuotojas" ? "myAdds" : "allAdds",
  );
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredGroupsMyGroups = userGroups.filter((group) =>
    group.groupName.toLowerCase().includes(searchQueryMyGroups.toLowerCase()),
  );

  const filteredAddsAllAdds = allAdds.filter((adds) =>
    adds.adsName.toLowerCase().includes(searchQueryAllGroups.toLowerCase()),
  );

  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        {/* Adjusted width */}
        <ul className="flex flex-wrap -mb-px border-b border-gray-200">
          {user.role === "Darbuotojas" && (
            <li className="me-2">
              <button
                className={`inline-block p-4  ${
                  activeTab === "myAdds"
                    ? "border-custom-800 border-b-2 rounded-t-lg"
                    : "hover:text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => handleTabClick("myAdds")}
              >
                Mano reklamos
              </button>
            </li>
          )}
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "allAdds"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("allAdds")}
            >
              Visos reklamos
            </button>
          </li>
        </ul>
        {activeTab === "myAdds" ? (
          <>
            {filteredGroupsMyGroups.length === 0 ? (
              <p className="mt-5">
                Jūs nesate sukūrę jokių reklamų, sukurkite!
              </p>
            ) : (
              <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
        {activeTab === "allAdds" ? (
          <>
            <input
              type="text"
              placeholder="Ieškoti reklamos pagal pavadinima"
              value={searchQueryAllGroups}
              onChange={(e) => setSearchQueryAllGroups(e.target.value)}
              className="p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-800"
              style={{ width: "80%" }} // Adjust the width as needed
            />
            {filteredAddsAllAdds.length === 0 ? (
              <p className="mt-5">Nėra reklamų!</p>
            ) : (
              <div>
                <div className="flex justify-between pb-5"></div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="p-4">
                          Reklamos pavadinimas
                        </th>
                        <th scope="col" className="p-4">
                          Reklamą sukūrė
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through all adds and render table rows */}
                      {filteredAddsAllAdds.map((add, index) => (
                        <tr
                          key={add.id}
                          className="bg-white border-b  hover:bg-gray-50 "
                        >
                          {/* Make each row clickable and redirect to a specific route */}
                          <td className="px-6 py-4 cursor-pointer">
                            <Link
                              to={"/groups/" + add.id}
                              className="font-medium text-gray-900  hover:underline"
                            >
                              {add.adsName}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            {/* Display the owner's username */}
                            {allAddsCreators[index] || "Unknown"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
      {user.role === "Darbuotojas" && (
        <div className="p-6 bg-custom-200 text-medium mt-3 mr-3 ">
          <div className="flex justify-center ">
            <Link
              className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
              to={"new"}
            >
              Sukurti reklamą
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
