import NavBarHeader from "./NavBarHeader";

interface NavBarButtonProps {
  title: string;
  activeTab: string;
  handleTabClick: (tab: string) => void;
}

function NavBarButton({ title, activeTab, handleTabClick }: NavBarButtonProps) {
  return (
    <div>
      <button
        className={`flex justify-center px-4 py-3 ${
          activeTab === title
            ? "text-white bg-custom-850"
            : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
        } w-full`}
        onClick={() => handleTabClick(title)}
      >
        {title}
      </button>
    </div>
  );
}

interface NavBarProps {
  title: string;
  handleTabClick: (tab: string) => void;
  redirectTo: string;
  activeTab: string;
  tabTitles: string[];
}

export default function NavBar({
  title,
  handleTabClick,
  activeTab,
  tabTitles,
  redirectTo,
}: NavBarProps) {
  return (
    <div>
      <div className="flex flex-col flex-grow w-80 border-r-2 border-black bg-custom-800 h-screen overflow-auto mr-3">
        <div className="h-32 flex justify-center items-center">
          <a href={`/${redirectTo}`} className="text-4xl text-white ">
            {title}
          </a>
        </div>
        <div className="flex-grow">
          {Array.from({ length: tabTitles.length }).map((_, index) => (
            <NavBarButton
              title={tabTitles[index]}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
