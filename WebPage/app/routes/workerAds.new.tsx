import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import GroupsCreationInformation from "~/components/workerAds/workerAdsInformation";
import { createWorkerAds } from "~/models/workerAds.server";
import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [
  { title: "Nauja reklama - Žemaičiai" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  console.log(user.email);

  if (user.role !== "Darbuotojas") {
    return redirect("/workerAds");
  }
  return json(user);
};

export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formId = formData.get("form-id");

  const ownerUserID = formData.get("whoCreated");
  const customName = String(formData.get("customName"));
  const description = String(formData.get("fullDescription"));
  const videoOne = String(formData.get("videoOne"));
  const videoTwo = String(formData.get("videoTwo"));
  const videoThird = String(formData.get("videoThird"));
  const WorkerAds = await createWorkerAds(
    ownerUserID,
    customName,
    description,
    videoOne,
    videoTwo,
    videoThird,
  );

  if (WorkerAds) {
    return redirect("/workerAds");
  } else {
    return null;
  }
};

export default function NewOrderPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex-grow mr-6">
      <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ml-3 mt-3 mr-3">
        <h1 className="text-3xl font-mono font-font-extralight pb-3">
          Informacija apie reklamų kūrimus
        </h1>
        <GroupsCreationInformation></GroupsCreationInformation>
      </div>
      <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ml-3 mt-3 mr-3 mb-5">
        <h1 className="text-3xl font-mono font-font-extralight pb-3">
          Reklamos sukūrimas
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
                placeholder="test"
                hidden
              />
              <input
                id="whoCreated"
                name="whoCreated"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                value={data.id}
                hidden
              />
              <input
                id="customName"
                name="customName"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                placeholder="Reklamos pavadinimas"
              />
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
                    placeholder="Reklamos aprašymas"
                    style={{ resize: "none" }} // Disable resizing
                    rows={7}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="w-full  px-3 mb-2">
              <input
                id="videoOne"
                name="videoOne"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                placeholder="Video nuoroda į pavyzdį"
              />
            </div>
            <div className="w-full  px-3 mb-2 ">
              <input
                id="videoTwo"
                name="videoTwo"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                placeholder="Video nuoroda į pavyzdį"
              />
            </div>
            <div className="w-full px-3 mb-2 ">
              <input
                id="videoThird"
                name="videoThird"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                placeholder="Video nuoroda į pavyzdį"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
          >
            Sukurti reklamą
          </button>
        </Form>
      </div>
    </div>
  );
}
