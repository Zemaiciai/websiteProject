import { json } from "@remix-run/node";
import { useState } from "react";

import { requireUser } from "~/session.server";

import ProfilePageSocialMedia from "./profilePageSocialMedia";
import ProfilePageTabsSkills from "./profilePageTabsSkills";
import ProfileSettings from "./profileSettings";
import { useUser } from "~/utils";
import { Form } from "@remix-run/react";
import { workExamples } from "@prisma/client";
import YouTube from "react-youtube";
interface Errors {
  fbLinkError?: string;
  igLinkError?: string;
  twLinkError?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  video4?: string;
  video5?: string;
}
type JsonifyObject<T> = {
  [K in keyof T]: T[K] extends object
    ? JsonifyObject<T[K]> | null
    : T[K] | null;
};
interface UserInfoProps {
  user: any;
  errorData: JsonifyObject<Errors> | null | undefined;
  workExample: workExamples | null | undefined;
}

function ProfilePageTabs({ user, errorData, workExample }: UserInfoProps) {
  const [activeTab, setActiveTab] = useState("statistics");
  const [edit, setEdit] = useState(false);
  const realuser = useUser();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handelButtonClick = () => {
    setEdit(true);
  };
  const isUserInProfile = () => {
    // Check if the user is in their profile
    return user.id === realuser.id; // Assuming user ID is used for identification
  };
  const YoutubeLinkToId = (link: string) => {
    const youtubePattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
    const match = link.match(youtubePattern);
    return match[1];
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
            Statistika
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
            Įgudžiai
          </button>
        </li>
        <li className="me-2">
          <button
            className={`inline-block p-4  ${
              activeTab === "example"
                ? "border-custom-800 border-b-2 rounded-t-lg"
                : "hover:text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleTabClick("example")}
          >
            Darbo pavyzdžiai
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
              Nustatymai
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
            <ProfileSettings errorData={errorData} />
          </>
        ) : null}
        {activeTab === "example" ? (
          <>
            <div className="exampleDiv border rounded border-grey-200 space-y-4">
              <ul className="list-disc pl-8">
                {workExample?.examples.map((videoLink, index) => (
                  // <li key={index} className="py-2">
                  //   <a
                  //     href={videoLink}
                  //     target="_blank"
                  //     rel="noopener noreferrer"
                  //   >
                  //     {videoLink}
                  //   </a>

                  // </li>
                  <YouTube videoId={YoutubeLinkToId(videoLink)} />
                ))}
              </ul>
              {isUserInProfile() && (
                <button
                  onClick={() => handleTabClick("changeExample")}
                  className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Redaguoti
                </button>
              )}
            </div>
          </>
        ) : null}
        {activeTab === "changeExample" ? (
          <>
            <Form method="post">
              <div className="exampleDiv space-x-1 ">
                <input name="form-id" hidden defaultValue="changeExample" />
                <input name="userid" hidden defaultValue={realuser.id} />
                <input
                  type="video1"
                  name="video1"
                  id="video1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={workExample?.examples[0]}
                />
                {errorData?.video1 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video1}
                  </div>
                ) : null}
                <input
                  type="video2"
                  name="video2"
                  id="video2"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={workExample?.examples[1]}
                />
                {errorData?.video2 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video2}
                  </div>
                ) : null}
                <input
                  type="video3"
                  name="video3"
                  id="video3"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={workExample?.examples[2]}
                />
                {errorData?.video3 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video3}
                  </div>
                ) : null}
                <input
                  type="video4"
                  name="video4"
                  id="video4"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={workExample?.examples[3]}
                />
                {errorData?.video4 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video4}
                  </div>
                ) : null}
                <input
                  type="video5"
                  name="video5"
                  id="video5"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                  placeholder="youtube.com/"
                  value={workExample?.examples[4]}
                />
                {errorData?.video5 ? (
                  <div
                    className="pt-1 font-bold text-red-500"
                    id="firstname-error"
                  >
                    {errorData.video5}
                  </div>
                ) : null}
                {isUserInProfile() && (
                  <button
                    type="submit"
                    onClick={handelButtonClick}
                    className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                  >
                    Išsaugoti
                  </button>
                )}
              </div>
            </Form>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ProfilePageTabs;
