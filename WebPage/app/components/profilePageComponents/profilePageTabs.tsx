import { json } from "@remix-run/node";
import { useState } from "react";

import { requireUser } from "~/session.server";

import ProfilePageSocialMedia from "./profilePageSocialMedia";
import ProfilePageTabsSkills from "./profilePageTabsSkills";
import ProfileSettings from "./profileSettings";
import { useUser } from "~/utils";

interface UserInfoProps {
  user: any;
}

function ProfilePageTabs({ user }: UserInfoProps) {
  const [activeTab, setActiveTab] = useState("statistics");
  const realuser = useUser();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const isUserInProfile = () => {
    // Check if the user is in their profile
    return user.id === realuser.id; // Assuming user ID is used for identification
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 mt-6 pl-24">
      <ul className="flex flex-wrap -mb-px border-b border-gray-200">
        <li className="me-2">
          <button
            className={`inline-block p-4  ${
              activeTab === "statistics"
                ? "border-custom-800 border-b-2 rounded-t-lg"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("statistics")}
          >
            Statistics
          </button>
        </li>
        <li className="me-2">
          <button
            className={`inline-block p-4  ${
              activeTab === "skills"
                ? "border-custom-800 border-b-2 rounded-t-lg"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("skills")}
          >
            Skills
          </button>
        </li>
        {isUserInProfile() && (
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "settings"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("settings")}
            >
              Settings
            </button>
          </li>
        )}
      </ul>
      <div className="p-6 text-medium text-gray-500 rounded-lg w-[800px] h-[400px]">
        {activeTab === "statistics" ? (
          <>
            <div className="statsDiv border rounded border-grey-200">
              <p>Statistika</p>
            </div>
          </>
        ) : null}
        {activeTab === "skills" ? (
          <>
            <ProfilePageTabsSkills />
          </>
        ) : null}
        {activeTab === "settings" ? (
          <>
            <ProfileSettings />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ProfilePageTabs;
