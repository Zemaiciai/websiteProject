import { Link } from "@remix-run/react";

interface NavBarButtonProps {
  title: string;
  activeTab: string;
  redirectTo: string;
  handleTabClick: (tab: string) => void;
}

function NavBarButton({
  title,
  activeTab,
  redirectTo,
  handleTabClick,
}: NavBarButtonProps) {
  return (
    <Link
      className={`flex justify-center px-4 py-3 ${
        activeTab === title
          ? "text-white bg-custom-850"
          : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
      } w-full`}
      to={"/" + redirectTo}
      onClick={() => handleTabClick(title)}
    >
      {title}
    </Link>
  );
}

interface NavBarProps {
  title: string;
  handleTabClick: (tab: string) => void;
  redirectTo: string;
  activeTab: string;
  tabTitles: { [redirectTo: string]: string };
}

export default function NavBar({
  title,
  handleTabClick,
  activeTab,
  tabTitles,
  redirectTo,
}: NavBarProps) {
  return (
    <div className="flex flex-col w-72 border-r-2 border-black bg-custom-900 h-screen overflow-auto">
      <Link
        to={`/${redirectTo}`}
        className="text-4xl text-white h-32 flex justify-center items-center"
      >
        {title}
      </Link>
      <div className="h-max">
        {Object.keys(tabTitles).map((redirectTo, _) => (
          <NavBarButton
            key={redirectTo}
            title={tabTitles[redirectTo]}
            redirectTo={redirectTo}
            activeTab={activeTab}
            handleTabClick={handleTabClick}
          />
        ))}
      </div>
    </div>
  );
}
