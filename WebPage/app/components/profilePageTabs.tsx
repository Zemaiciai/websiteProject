import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import react-router-dom

import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }) => {
  const user = await requireUser(request);
  return json({ user });
};

function ProfilePageTabs() {
  const [activeTab, setActiveTab] = useState("statistics");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 mt-6 pl-24">
      <ul className="flex flex-wrap -mb-px border-b border-gray-200">
        <li className="me-2">
          <button
            className={`inline-block p-4  ${
              activeTab === "statistics"
                ? "border-sky-500 border-b-2 rounded-t-lg"
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
                ? "border-sky-500 border-b-2 rounded-t-lg"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("skills")}
          >
            Skills
          </button>
        </li>
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
            <div className="skillsDiv border rounded border-grey-200">
              <p>Skillai</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ProfilePageTabs;
