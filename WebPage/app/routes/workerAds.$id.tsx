import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "~/models/user.server";
import {
  WorkerAdsUpdate,
  deleteAdd,
  getAddByID,
} from "~/models/workerAds.server";
import { requireUser } from "~/session.server";
import { validateCreateWorkerAd } from "~/utils";
export const meta: MetaFunction = () => [
  { title: "Reklamos peržiūra - Žemaičiai" },
];
interface ChangeWorkerAdErrors {
  adName?: string;
  adDescription?: string;
  video1?: string;
  video2?: string;
  video3?: string;
  limit?: string;
}
export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formid = formData.get("form-id");
  const errors: ChangeWorkerAdErrors = {};
  if (formid === "changeInformation") {
    const whoCreated = formData.get("whoCreated"); // persons id
    const workerAddID = formData.get("workerAddID"); // group id
    const customName = formData.get("customName");
    const fullDescription = formData.get("fullDescription");
    const videoOne = formData.get("videoOne");
    const videoTwo = formData.get("videoTwo");
    const videoThird = formData.get("videoThird");
    const validationErrors = await validateCreateWorkerAd(
      customName,
      fullDescription,
      videoOne,
      videoTwo,
      videoThird,
      errors,
      whoCreated,
    );

    if (validationErrors !== null) {
      return json(errors);
    }
    const updated = await WorkerAdsUpdate(
      whoCreated,
      workerAddID,
      customName,
      fullDescription,
      videoOne,
      videoTwo,
      videoThird,
    );
    if (updated) {
      return redirect("/workerAds");
    }
  }

  if (formid === "goToProfile") {
    const whoCreated = formData.get("whoCreated");
    return redirect("/profile/" + whoCreated);
  }

  if (formid === "deleteAdd") {
    const groupId = formData.get("groupId");

    deleteAdd(groupId);
    return redirect("/workerAds");
  }
  return null;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userUsingRN = await requireUser(request);

  const url = request.url;
  const parts = url.split("/");
  const workerAddId = parts[parts.length - 1];

  const getGroup = await getAddByID(workerAddId);

  const getAddOwner = await getUserById(String(getGroup?.userid));

  return json({ userUsingRN, getGroup, getAddOwner });
};

const GroupDetailPage = () => {
  const { addId } = useParams();
  const { userUsingRN, getGroup, getAddOwner } = useLoaderData<typeof loader>();
  const [activeTabUsers, setActiveTabUsers] = useState("mainPage");
  const handleTabClickUser = (tab: string) => {
    setActiveTabUsers(tab);
  };
  const errorData = useActionData<ChangeWorkerAdErrors>();
  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        <ul className="flex flex-wrap -mb-px border-b border-gray-200 pb-3">
          <div>
            <h1 className="font-bold text-2xl pt-4 pl-3">
              Peržiūrite reklamą kurios pavadinimas: {getGroup?.adsName}
            </h1>
          </div>
        </ul>
        {activeTabUsers === "mainPage" ? (
          <>
            <div>
              <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap">
                Reklamą sukūrusio darbuotojo informacija:
              </h1>
              <h1 className=" text-1xl pt-1 pl-3 text-wrap">
                Vardas pavardė: {getAddOwner?.firstName} {getAddOwner?.lastName}
              </h1>
              <h1 className=" text-1xl pt-1 pl-3 text-wrap">
                Slapyvardis: {getAddOwner?.userName}
              </h1>
              <h1 className=" text-1xl pt-1 pl-3 text-wrap">
                Paskyros statusas: {getAddOwner?.userStatus}
              </h1>
            </div>
            <div className="">
              <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap">
                Reklamos aprašymas:
              </h1>
              <textarea
                className="text-1xl pt-1 pl-3 text-wrap break-words w-full h-[250px] resize-none"
                readOnly
              >
                {getGroup?.adsDescription}
              </textarea>
            </div>
            <div>
              <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap">
                Pavyzdžiai:
              </h1>
              <ul className="list-disc pl-8">
                {getGroup?.adsExamples.map((videoLink, index) => (
                  <li key={index} className="py-2">
                    <a
                      href={videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {videoLink}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}

        {activeTabUsers === "changeInformation" ? (
          <>
            <div className="pl-3">
              <h1 className="font-bold text-1xl pt-4 text-wrap mb-5">
                Reklamos informacijos keitimas:
              </h1>
              <Form method="post">
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full  px-3 mb-6 md:mb-0">
                    <input
                      id="form-id"
                      name="form-id"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue="changeInformation"
                      hidden
                    />
                    <input
                      id="whoCreated"
                      name="whoCreated"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={getAddOwner?.id}
                      hidden
                    />
                    <input
                      id="workerAddID"
                      name="workerAddID"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={getGroup?.id}
                      hidden
                    />
                    <input
                      id="customName"
                      name="customName"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={getGroup?.adsName}
                    />
                    {errorData?.adName ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.adName}
                      </div>
                    ) : null}
                  </div>

                  {/* New textarea field */}
                  <div className="w-full px-3 mt-3">
                    <div className="flex flex-col">
                      <div className="relative">
                        <textarea
                          id="fullDescription"
                          name="fullDescription"
                          autoComplete="on"
                          className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black resize-none"
                          defaultValue={getGroup?.adsDescription}
                          style={{ resize: "none" }} // Disable resizing
                          rows={7}
                        ></textarea>
                        {errorData?.adDescription ? (
                          <div
                            className="pt-1 font-bold text-red-500"
                            id="firstname-error"
                          >
                            {errorData.adDescription}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="pl-3">
                    <h1 className="font-bold text-1xl text-wrap mb-1">
                      Pavyzdžių nuorodos
                    </h1>
                  </div>

                  <div className="w-full  px-3 mb-2">
                    <input
                      id="videoOne"
                      name="videoOne"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={getGroup?.adsExamples[0]}
                    />
                    {errorData?.video1 ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.video1}
                      </div>
                    ) : null}
                  </div>
                  <div className="w-full  px-3 mb-2 ">
                    <input
                      id="videoTwo"
                      name="videoTwo"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={getGroup?.adsExamples[1]}
                    />
                    {errorData?.video2 ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.video2}
                      </div>
                    ) : null}
                  </div>
                  <div className="w-full px-3 mb-2 ">
                    <input
                      id="videoThird"
                      name="videoThird"
                      type="text"
                      autoComplete="on"
                      className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                      defaultValue={getGroup?.adsExamples[2]}
                    />
                    {errorData?.video3 ? (
                      <div
                        className="pt-1 font-bold text-red-500"
                        id="firstname-error"
                      >
                        {errorData.video3}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                >
                  Atnaujinti reklamos informacija
                </button>
              </Form>
            </div>
          </>
        ) : null}
      </div>

      <div className="p-6 bg-custom-200 text-medium mt-3 mr-3 ">
        <div className="flex justify-center pb-2">
          <button
            className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
              activeTabUsers === "mainPage"
                ? "text-white  py-2 bg-custom-900  border-black "
                : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
            } w-full`}
            onClick={() => handleTabClickUser("mainPage")}
          >
            Pagrindinis
          </button>
        </div>

        {userUsingRN.id === getAddOwner?.id && (
          <>
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "changeInformation"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("changeInformation")}
              >
                Keisti informacija
              </button>
            </div>
            <div className="flex justify-center pb-2">
              <Form method="post">
                <input
                  id="form-id"
                  name="form-id"
                  type="text"
                  autoComplete="on"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                  defaultValue="deleteAdd"
                  hidden
                />

                <input
                  id="groupId"
                  name="groupId"
                  type="text"
                  autoComplete="on"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                  defaultValue={getGroup?.id}
                  hidden
                />

                <button
                  type="submit"
                  className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-11 rounded text-nowrap
                      ? "bg-custom-900 border-black"
                      : "bg-custom-800  transition duration-300 ease-in-out border-black"
                  }`}
                >
                  Ištrinti reklamą
                </button>
              </Form>
            </div>
          </>
        )}

        {userUsingRN.id !== getAddOwner?.id && (
          <div className="flex justify-center pb-2">
            <Form method="post">
              <input
                id="form-id"
                name="form-id"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                defaultValue="goToProfile"
                hidden
              />
              <input
                id="whoCreated"
                name="whoCreated"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                defaultValue={getAddOwner?.id}
                hidden
              />

              <button
                type="submit"
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-11 rounded text-nowrap
                      ? "bg-custom-900 border-black"
                      : "bg-custom-800  transition duration-300 ease-in-out border-black"
                  }`}
              >
                Eiti į profilį
              </button>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};

export default GroupDetailPage;
