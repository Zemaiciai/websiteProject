import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import GroupsCreationInformation from "~/components/workerAds/workerAdsInformation";
import { createConversation } from "~/models/messages.server";
import { getUserByEmail, getUserById } from "~/models/user.server";
import { createWorkerAds } from "~/models/workerAds.server";
import { requireUser } from "~/session.server";
export const meta: MetaFunction = () => [
  { title: "Naujas pokalbis - Žemaičiai" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  console.log(user.email);

  return json(user);
};
interface Errors {
  createMessage?: string;
}
export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formId = formData.get("form-id");
  const errors: Errors = {};
  const ownerUserID = formData.get("whoCreated");
  const messageEmail = String(formData.get("messageEmail"));
  const user = await getUserByEmail(messageEmail);
  if (!user) {
    errors.createMessage = "Tokio vartotojo nėra";
  } else if (user.id === ownerUserID) {
    errors.createMessage = "Negalite susikurti susirašinėjimo su savimi";
  }
  if (errors.createMessage) {
    return errors;
  }
  const message = await createConversation(ownerUserID, messageEmail);

  if (message) {
    return redirect("/messages");
  } else {
    return null;
  }
};

export default function NewOrderPage() {
  const data = useLoaderData<typeof loader>();
  const errorData = useActionData<Errors>();
  return (
    <div className="flex-grow mr-6">
      <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ml-3 mt-3 mr-3 mb-5">
        <h1 className="text-3xl font-mono font-font-extralight pb-3">
          Žinutės sukūrimas
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
                placeholder="messageNew"
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
                id="messageEmail"
                name="messageEmail"
                type="text"
                autoComplete="on"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                placeholder="Naudotojo el. paštas"
              />
              {errorData?.createMessage ? (
                <div
                  className="pt-1 font-bold text-red-500"
                  id="firstname-error"
                >
                  {errorData.createMessage}
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-custom-800  px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
          >
            Sukurti žinutę!
          </button>
        </Form>
      </div>
    </div>
  );
}
