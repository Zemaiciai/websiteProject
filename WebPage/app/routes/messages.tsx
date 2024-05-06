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
    <div className="flex h-full">
      <Outlet />
    </div>
  );
};

export default Dashboard;
