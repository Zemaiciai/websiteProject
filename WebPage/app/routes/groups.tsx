import { MetaFunction, Outlet } from "@remix-run/react";
import { useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];

export default function Groups() {
  const [activeTab, setActiveTab] = useState("myGroups");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-full flex flex-grow flex-col bg-custom-100 pb-3">
      <div className="flex justify-between overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
