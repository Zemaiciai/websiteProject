import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { typedjson } from "remix-typedjson";
import { getConversations } from "~/models/messages.server";

import {
  getAllMyAdds,
  getAllWorkerAdds,
  getAllWorkerAddsCreators,
} from "~/models/workerAds.server";
import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [{ title: "Žinutės - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  const messagesList = await getConversations(user.id);

  return typedjson({
    user,
    messagesList,
  });
};

interface Conversation {
  id: string;
  participants: Participant[];
  updatedAt: Date;
  // Add other properties as needed
}

interface Participant {
  id: string;
  name: string;
  firstName: string; // Add firstName property
  lastName: string; // Add lastName property
  // Add other participant properties as needed
}

export default function GroupsIndexPage() {
  const { user } = useLoaderData<typeof loader>();

  const [searchQueryAllGroups, setSearchQueryAllGroups] = useState("");

  const [activeTab, setActiveTab] = useState(
    user.role === "Darbuotojas" ? "messages" : "messages",
  );
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const messagesList: Conversation[] =
    useLoaderData<typeof loader>().messagesList;

  let filteredMessagesList = messagesList;

  if (searchQueryAllGroups) {
    filteredMessagesList = messagesList.filter((conversation) =>
      conversation.participants.some((participant) => {
        const fullName =
          `${participant.firstName} ${participant.lastName}`.toLowerCase();
        return (
          participant && fullName.includes(searchQueryAllGroups.toLowerCase())
        );
      }),
    );
  }
  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        <ul className="flex flex-wrap -mb-px border-b border-gray-200">
          <li className="me-2">
            <button
              className="inline-block p-4 border-custom-800 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300"
              onClick={() => handleTabClick("messages")}
            >
              Žinutės
            </button>
          </li>
        </ul>

        {activeTab === "messages" ? (
          <>
            <input
              type="text"
              placeholder="Ieškoti žinutės pagal vartotoją"
              value={searchQueryAllGroups}
              onChange={(e) => setSearchQueryAllGroups(e.target.value)}
              className="p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-800"
              style={{ width: "80%" }}
            />
            {filteredMessagesList.length > 0 ? (
              // Render the table if there are conversations
              <div>
                <div className="flex justify-between pb-5"></div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="p-4">
                          Vartotojas
                        </th>
                        <th scope="col" className="p-4">
                          Paskutinė žinutė
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Map through conversations and render table rows */}
                      {filteredMessagesList.map((conversation) => (
                        <tr className="bg-white border-b ">
                          <Link
                            key={conversation.id}
                            to={`/messages/${conversation.id}`}
                            className="block"
                          >
                            <td className="px-6 py-4 cursor-pointer">
                              {/* Display participant information excluding the current user */}
                              {conversation.participants.map(
                                (participant) =>
                                  participant.id !== user.id && (
                                    <div key={participant.id}>
                                      <span>{participant.firstName}</span>{" "}
                                      <span>{participant.lastName}</span>
                                    </div>
                                  ),
                              )}
                            </td>
                          </Link>
                          <td className="px-6 py-4">
                            {conversation.updatedAt
                              ? new Date(conversation.updatedAt)
                                  .toLocaleDateString("en-CA", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                  .replace(/\//g, "-") +
                                ", " +
                                new Date(
                                  conversation.updatedAt,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                              : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Render a message if there are no conversations
              <p className="mt-5">Nėra žinučių!</p>
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
            Sukurti žinutę
          </Link>
        </div>
      </div>
    </>
  );
}
