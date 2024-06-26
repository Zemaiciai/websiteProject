import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import GroupsCreationInformation from "~/components/Groups/groupsCreationInformation";
import { createGroup } from "~/models/groups.server";
import { requireUser } from "~/session.server";
import { validateCreateGroup } from "~/utils";
export const meta: MetaFunction = () => [{ title: "Nauja grupė - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json(user);
};
interface Errors {
  groupName?: string;
  groupShortDesc?: string;
  groupDescription?: string;
}
export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formId = formData.get("form-id");
  const ownerUserID = formData.get("owner");
  const errors: Errors = {};
  const customName = String(formData.get("customName"));
  const shortDescription = String(formData.get("shortDescription"));
  const fullDescription = String(formData.get("fullDescription"));

  const validationErrors = await validateCreateGroup(
    customName,
    shortDescription,
    fullDescription,
    errors,
    false,
  );

  if (validationErrors !== null) {
    return json(errors);
  }

  const createdGroup = await createGroup(
    customName,
    shortDescription,
    fullDescription,
    ownerUserID,
  );

  if (createdGroup) {
    return redirect("/groups");
  }

  return null;
};

export default function NewOrderPage() {
  const data = useLoaderData<typeof loader>();
  const errorData = useActionData<Errors>();
  return (
    <div className="flex grow flex-col h-full w-full">
      <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ">
        <h1 className="text-3xl font-mono font-font-extralight pb-3">
          Informacija apie grupių kūrimus
        </h1>
        <GroupsCreationInformation></GroupsCreationInformation>
      </div>
      <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ">
        <h1 className="text-3xl font-mono font-font-extralight pb-3">
          Grupės sukūrimas
        </h1>
        <Form method="post">
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <div className="flex flex-col">
                <div className="relative">
                  <input
                    id="form-id"
                    name="form-id"
                    type="text"
                    autoComplete="on"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                    placeholder="test"
                    hidden
                  />
                  <input
                    id="owner"
                    name="owner"
                    type="text"
                    autoComplete="on"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                    value={data.id}
                    readOnly
                    hidden
                  />
                  <input
                    id="customName"
                    name="customName"
                    type="text"
                    autoComplete="on"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                    placeholder="Grupės pavadinimas"
                  />
                  {errorData?.groupName ? (
                    <div
                      className="pt-1 font-bold text-red-500"
                      id="firstname-error"
                    >
                      {errorData.groupName}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <div className="flex flex-col">
                <div className="relative">
                  <input
                    id="shortDescription"
                    name="shortDescription"
                    type="text"
                    autoComplete="on"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                    placeholder="Grupės apibūdinimas (MAX N simbolių) bus rodomas sąraše"
                  />
                  {errorData?.groupShortDesc ? (
                    <div
                      className="pt-1 font-bold text-red-500"
                      id="firstname-error"
                    >
                      {errorData.groupShortDesc}
                    </div>
                  ) : null}
                </div>
              </div>
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
                    placeholder="Grupės aprašymas"
                    style={{ resize: "none" }} // Disable resizing
                    rows={7}
                  ></textarea>

                  {errorData?.groupDescription ? (
                    <div
                      className="pt-1 font-bold text-red-500"
                      id="firstname-error"
                    >
                      {errorData.groupDescription}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
          >
            Sukurti grupę
          </button>
        </Form>
      </div>
    </div>
  );
}
