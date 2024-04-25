import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";

import {
  getAllMyAdds,
  getAllWorkerAdds,
  getAllWorkerAddsCreators,
} from "~/models/workerAds.server";
import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [{ title: "Reklama - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  const allAdds = await getAllWorkerAdds();
  const allAddsCreators = await getAllWorkerAddsCreators();
  const myAdds = await getAllMyAdds(user.id);

  return json({
    user,
    myAdds,
    allAdds,
    allAddsCreators,
  });
};

export default function GroupsIndexPage() {
  const { user, myAdds, allAdds, allAddsCreators } =
    useLoaderData<typeof loader>();

  const [searchQueryAllGroups, setSearchQueryAllGroups] = useState("");

  const [activeTab, setActiveTab] = useState(
    user.role === "Darbuotojas" ? "myAdds" : "allAdds",
  );
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

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
            {myAdds.length === 0 ? (
              <p className="mt-5">
                Jūs nesate sukūrę jokių reklamų, sukurkite!
              </p>
            ) : (
              <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="p-4">
                          Reklamos pavadinimas
                        </th>
                        <th scope="col" className="p-4">
                          Reklamos sukūrimo data
                        </th>
                        <th scope="col" className="p-4">
                          Reklamos atnaujinimo data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through filtered groups and render table rows */}
                      {myAdds.map((group) => {
                        return (
                          <tr
                            key={group.id}
                            className="bg-white border-b  hover:bg-gray-50 "
                          >
                            {/* Make each row clickable and redirect to a specific route */}
                            <td className="px-6 py-4 cursor-pointer">
                              <Link
                                to={"/workerAds/" + group.id}
                                className="font-medium text-gray-900  hover:underline"
                              >
                                {group.adsName}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              {/* Display the owner's username */}
                              {new Date(group.createdAt).toLocaleString(
                                "lt-LT",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                },
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {/* Display the owner's username */}
                              {new Date(group.updatedAt).toLocaleString(
                                "lt-LT",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                },
                              )}
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
                        <th scope="col" className="p-4">
                          Atnaujinimo data
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
                              to={"/workerAds/" + add.id}
                              className="font-medium text-gray-900  hover:underline"
                            >
                              {add.adsName}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            {/* Display the owner's username */}
                            {allAddsCreators[index] || "Unknown"}
                          </td>

                          <td className="px-6 py-4">
                            {/* Display the owner's username */}
                            {new Date(add.updatedAt).toLocaleString("lt-LT", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
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
