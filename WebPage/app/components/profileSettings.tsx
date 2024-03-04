import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";

import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }) => {
  const user = await requireUser(request);
  return json({ user });
};

function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useUser();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="settingsMainDiv">
      <div className="md:flex">
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-sky-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0 w-[200px]">
          <li>
            <button
              className={`inline-flex items-center px-4 py-3 rounded-lg ${
                activeTab === "profile"
                  ? "text-gray-900 bg-gray-200"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              } w-full`}
              onClick={() => handleTabClick("profile")}
            >
              Profile Picture
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center px-4 py-3 rounded-lg ${
                activeTab === "dashboard"
                  ? "text-gray-900 bg-gray-200"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              } w-full`}
              onClick={() => handleTabClick("dashboard")}
            >
              Background Picture
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center px-4 py-3 rounded-lg ${
                activeTab === "settings"
                  ? "text-gray-900 bg-gray-200"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              } w-full`}
              onClick={() => handleTabClick("settings")}
            >
              Settings
            </button>
          </li>
          <li>
            <Form
              action={"/profile/" + user.id}
              method="get"
              className="flex justify-end"
            >
              <button
                className={`inline-flex items-center px-4 py-3 rounded-lg ${
                  activeTab === "settings"
                    ? "text-gray-900 bg-gray-200"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                } w-[100px] text-gray-900`}
              >
                Close
                <svg
                  className="w-3 h-3 ml-[20px]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </Form>
          </li>
        </ul>
        <div className="p-6 bg-gray-100 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-[800px] h-[400px]">
          {activeTab === "profile" ? (
            <>
              <div className=" items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, or JPG (MAX. XxYpx)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                  <span className="sr-only">Upload an image</span>
                </label>
                <Form method="get" className="saveButton flex justify-end mt-4">
                  <button className="text-base font-semibold text-neutral-600 rounded border border-gray-400 w-20 h-8 hover:bg-gray-100 hover:text-gray-900">
                    Save
                  </button>
                </Form>
              </div>
            </>
          ) : null}
          {activeTab === "dashboard" ? (
            <>
              <div className=" items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, or JPG (MAX. XxYpx)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                  <span className="sr-only">Upload an image</span>
                </label>
                <Form method="get" className="saveButton flex justify-end mt-4">
                  <button className="text-base font-semibold text-neutral-600 rounded border border-gray-400 w-20 h-8 hover:bg-gray-100 hover:text-gray-900">
                    Save
                  </button>
                </Form>
              </div>
            </>
          ) : null}
          {activeTab === "settings" ? (
            <>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Settings Tab
              </h3>
              <p className="mb-2">
                This is some placeholder content for the Settings tab.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
