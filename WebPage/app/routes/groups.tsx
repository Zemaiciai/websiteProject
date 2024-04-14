import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, Outlet, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import NewFooter from "~/components/newFooter/NewFooter";

import { getAllMessages } from "~/models/customMessage.server";
import { useUser } from "~/utils";

const Dashboard = () => {
  const user = useUser();
  const [activeTab, setActiveTab] = useState("myGroups");
  const [linkClicked, setLinkClicked] = useState(false);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const handleLinkClick = () => {
    setLinkClicked(true);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/groups") {
      setLinkClicked(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex  bg-custom-100">
      {/* Navigation Sidebar */}
      <div className="navbar-container">
        <NavBar
          title={"Groups"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={"activeTab"}
          tabTitles={["Orders", "Admin", "Messages", "Profile"]}
        />
      </div>

      <div className="w-screen flex flex-col bg-custom-100 overflow-auto pb-3">
        <NavBarHeader
          title={`${linkClicked ? "Grupės sukurimas" : "Grupės"}`}
        />
        <div className="flex justify-between">
          {linkClicked ? (
            <Outlet />
          ) : (
            <>
              <div className="p-6 bg-custom-200 text-medium mt-3 ml-3 overflow-auto  ">
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
                    <div className="w-[1000px]">
                      <p>Mano grupės</p>
                    </div>
                  </>
                ) : null}
                {activeTab === "allGroups" ? (
                  <>
                    <div className="w-[1000px]">
                      <p>Visos grupės</p>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="p-6 bg-custom-200 text-medium mt-3 mr-3 overflow-auto">
                <div className="flex justify-center">
                  <Link
                    className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-4 rounded"
                    to={"new"}
                    onClick={handleLinkClick}
                  >
                    Sukurti grupę
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        <NewFooter></NewFooter>
      </div>
    </div>
  );
};

export default Dashboard;
