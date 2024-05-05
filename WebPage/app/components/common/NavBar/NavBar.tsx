import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

interface NavBarButtonProps {
  title: string;
  activeTab: string;
  redirectTo: string;
}

function NavBarButton({ title, activeTab, redirectTo }: NavBarButtonProps) {
  return (
    <Link
      className={`flex justify-center px-4 py-3 ${
        activeTab === title
          ? "text-white bg-custom-850"
          : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
      } w-full`}
      to={"/" + redirectTo}
    >
      {title}
    </Link>
  );
}

interface NavBarProps {
  title: string;
  redirectTo: string;
  tabTitles: { [redirectTo: string]: string };
}

export default function NavBar({ title, tabTitles, redirectTo }: NavBarProps) {
  const pathname = useLocation().pathname;
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setActiveTab(tabTitles[pathname.slice(1)]);
  }, [pathname]);

  return (
    <div className="flex flex-col w-72 border-r-2 border-black bg-custom-900 h-screen overflow-auto">
      <Link
        to={`/${redirectTo}`}
        className="text-4xl text-white h-32 flex justify-center items-center"
      >
        {title}
      </Link>
      <div className="h-max">
        {Object.keys(tabTitles).map((location, _) => (
          <NavBarButton
            key={location}
            title={tabTitles[location]}
            redirectTo={location}
            activeTab={activeTab}
          />
        ))}
      </div>
    </div>
  );
}
