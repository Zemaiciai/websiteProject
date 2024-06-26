import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";

import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

import ProfilePageSocialMedia from "./profilePageSocialMedia";
import SetProgram from "./SkillSetComponents/SetProgram";
import { socialMedia, User } from "@prisma/client";

export const loader = async ({ request }) => {
  const user = await requireUser(request);
  return json({ user });
};
interface Errors {
  fbLinkError?: string;
  igLinkError?: string;
  twLinkError?: string;
}
type JsonifyObject<T> = {
  [K in keyof T]: T[K] extends object
    ? JsonifyObject<T[K]> | null
    : T[K] | null;
};
interface UserInfoProps {
  errorData: JsonifyObject<Errors> | null | undefined;
  socialMediaLinks: socialMedia | null;
  userdata: User | null;
}

function ProfileSettings({
  errorData,
  socialMediaLinks,
  userdata,
}: UserInfoProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useUser();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const isUserWorker = () => {
    if (userdata?.role == "Darbuotojas") return true;
    return false;
  };

  return (
    <div className="settingsMainDiv h-full w-full">
      <div className="flex">
        <ul className="space-y space-y-4 text-sm font-medium text-custom-800 md:me-4 mb-4 md:mb-0 w-[200px]">
          <li>
            <button
              className={`inline-flex items-center px-4 py-3 rounded-lg ${
                activeTab === "profile"
                  ? "text-gray-900 bg-gray-200"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              } w-full`}
              onClick={() => handleTabClick("profile")}
            >
              Profilio nuotrauka
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center px-4 py-3 rounded-lg ${
                activeTab === "SocialMedia"
                  ? "text-gray-900 bg-gray-200"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              } w-full`}
              onClick={() => handleTabClick("SocialMedia")}
            >
              Socialiniai tinklai
            </button>
          </li>
          {isUserWorker() && (
            <li>
              <button
                className={`inline-flex items-center px-4 py-3 rounded-lg ${
                  activeTab === "settings"
                    ? "text-gray-900 bg-gray-200"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                } w-full`}
                onClick={() => handleTabClick("settings")}
              >
                Kiti nustatymai
              </button>
            </li>
          )}
        </ul>
        <div className="p-6 bg-gray-100 flex text-medium text-gray-500 rounded-lg w-full h-[22rem]">
          {activeTab === "profile" ? (
            <>
              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 "
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
                    <p className="mb-2 text-sm text-gray-500 ">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, or JPG (MAX. XxYpx)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                  <span>Upload an image</span>
                </label>
                <Form
                  method="get"
                  className="saveButton flex w-full justify-end mt-4"
                >
                  <button className="text-base font-semibold text-neutral-600 rounded border border-gray-400 w-20 h-8 hover:bg-gray-100 hover:text-gray-900">
                    Save
                  </button>
                </Form>
              </div>
            </>
          ) : null}
          {activeTab === "Dashboard" ? (
            <>
              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 "
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
                    <p className="mb-2 text-sm text-gray-500 ">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, or JPG (MAX. XxYpx)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                  <span>Upload an image</span>
                </label>
                <Form
                  method="get"
                  className="saveButton flex w-full justify-end mt-4"
                >
                  <button className="text-base font-semibold text-neutral-600 rounded border border-gray-400 w-20 h-8 hover:bg-gray-100 hover:text-gray-900">
                    Save
                  </button>
                </Form>
              </div>
            </>
          ) : null}
          {activeTab === "settings" ? (
            <>
              <div className="mainDivOfSkillSetTab">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Pasirinkite savo sugebėjimus
                </h3>
                <div className="mainDivOfSkillSet flex justify-start space-x-6">
                  <div className="usedPrograms">
                    <p>Naudojamos programos</p>
                    <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SetProgram programName={"Adobe"} />
                      <SetProgram programName={"Adobe"} />
                      <SetProgram programName={"Adobe"} />
                    </ul>
                  </div>
                  <div className="workHours">
                    <p>Norimos darbo valandos</p>
                  </div>
                  <div className="skills">
                    <p>Įgūdžiai</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {activeTab === "SocialMedia" ? (
            <>
              <ProfilePageSocialMedia
                errorData={errorData}
                socialMediaLinks={socialMediaLinks}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
