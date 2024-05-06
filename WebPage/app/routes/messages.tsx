import { MetaFunction, Outlet } from "@remix-run/react";
import { useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("myGroups");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-custom-100">
      {/* Navigation Sidebar */}
      <div className="navbar-container"></div>

      <div className="w-screen h-screen flex flex-grow flex-col bg-custom-100 pb-3">
        <div className="flex justify-between">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
