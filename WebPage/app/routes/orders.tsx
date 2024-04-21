import { MetaFunction, Outlet, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];
export default function WorkPage() {
  const [activeTab, setActiveTab] = useState("");
  const [headerTitle, setHeaderTitle] = useState("Loading...");

  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/orders":
        setHeaderTitle("Užsakymų sąrašas");
        break;
      case "/orders/new":
        setHeaderTitle("Užsakymo sukurimas");
        break;
      default:
        setHeaderTitle("Not Found 404");
        break;
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-custom-100">
      <div className="navbar-container">
        <NavBar
          title={"Žemaičiai"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={activeTab}
          tabTitles={["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]}
        />
      </div>
      <div className="jobs-page-container w-screen h-screen flex flex-col bg-custom-100 overflow-auto">
        <NavBarHeader title={headerTitle} />
        <main className="h-full m-4 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
