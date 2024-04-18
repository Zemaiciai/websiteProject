import { Outlet, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/orders") {
      setHeaderTitle("Užsakymų sąrašas");
    } else {
      setHeaderTitle("Užsakymo sukurimas");
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="jobs-page-container flex h-screen bg-custom-100">
      <div className="navbar-container">
        <NavBar
          title={"Orders"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={activeTab}
          tabTitles={["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]}
        />
      </div>
      <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto">
        <NavBarHeader title={headerTitle} />
        <main className="h-full m-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
