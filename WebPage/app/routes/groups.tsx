import { Link, MetaFunction, Outlet, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import NewFooter from "~/components/newFooter/NewFooter";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];
import { useUser } from "~/utils";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("myGroups");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-custom-100">
      {/* Navigation Sidebar */}
      <div className="navbar-container">
        <NavBar
          title={"Žemaičiai"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={activeTab}
          tabTitles={["Orders", "Admin", "Messages", "Profile"]}
        />
      </div>

      <div className="w-screen h-screen flex flex-grow flex-col bg-custom-100 pb-3">
        <NavBarHeader title={`${activeTab ? "Grupės sukurimas" : "Grupės"}`} />
        <div className="flex justify-between">
          <Outlet />
        </div>
        <div className="mt-3">
          <NewFooter />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
