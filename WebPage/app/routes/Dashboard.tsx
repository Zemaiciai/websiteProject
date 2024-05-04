import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Message from "~/components/DashBoardCustomMessagesDesign/Message";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import NewFooter from "~/components/newFooter/NewFooter";

import { getAllMessages } from "~/models/customMessage.server";
import { requireUser } from "~/session.server";
import { useUser } from "~/utils";
export const meta: MetaFunction = () => [{ title: "Titulinis - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return typedjson({
    customMessages: await getAllMessages(),
  });
};

const Dashboard = () => {
  const data = useTypedLoaderData<typeof loader>();

  const user = useUser();
  const [activeTab, setActiveTab] = useState("");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col h-full w-full bg-custom-100 overflow-auto">
        {data.customMessages.map(
          (message) =>
            message.visibility && (
              <div key={message.id}>
                <Message msg={message.message} priority={message.priority} />
              </div>
            ),
        )}

        <div className="grid grid-cols-4 col-span-1 gap-4 mr-10">
          <div className="bg-red-200 p-4 pb-16 rounded-md ml-10">
            <p>Stats</p>
          </div>
          <div className="bg-indigo-600 p-4 rounded-md">
            <p>Stats</p>
          </div>
          <div className="bg-indigo-800 p-4 rounded-md">
            <p>Stats</p>
          </div>
          <div className="bg-green-500 col-span-1 row-span-3 p-4 pb-64 rounded-md">
            <p>Stats</p>
          </div>
          <div className="bg-yellow-400 col-span-2 row-span-2 p-4 pt-16 pr-96 rounded-md ml-5">
            <p>Stats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
