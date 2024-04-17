import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useRef } from "react";
import { CustomInput } from "~/components/common/CustomInput";

import { createUser } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateRegistrationCredentials } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface Errors {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  secretCode?: string;
  existingUser?: string;
  wrongSecretCode?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const firstname = String(formData.get("firstname"));
  const lastname = String(formData.get("lastname"));
  const username = String(formData.get("username"));
  const secretCode = String(formData.get("secretCode"));
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  const errors: Errors = {};

  const validationErrors = await validateRegistrationCredentials(
    firstname,
    lastname,
    username,
    secretCode,
    email,
    password,
    errors,
  );

  if (validationErrors !== null) {
    return json({ errors: validationErrors }, { status: 400 });
  }

  const user = await createUser(
    email,
    password,
    firstname,
    lastname,
    username,
    secretCode,
  );

  if (!user) {
    errors.wrongSecretCode = "Neteisingas pakvietimo kodas arba el. paštas";
    return json({ errors: errors }, { status: 400 });
  }

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();

  return (
    <main className="w-screen h-screen bg-custom-100 overflow-auto">
      <div className="flex w-full h-full justify-center items-center py-2">
        <div className="flex relative bg-custom-200 h-full w-2/4 rounded-2xl overflow-auto">
          <div className="registration-container flex flex-grow-0 flex-col w-full">
            <div className="text-container pt-8 text-center">
              <span className="text-3xl text-custom-850 font-extrabold flex justify-center items-center flex-col">
                Registracija
                <hr className="border-2 mt-4 w-14 border-custom-850 rounded-2xl" />
              </span>
            </div>
            <div className="flex flex-col bg-white w-full h-full pt-6 px-10">
              <Form method="post" className="space-y-6" noValidate>
                <CustomInput
                  error={actionData?.errors.firstname}
                  name="firstname"
                  type="text"
                  title="Vardas"
                />
                <CustomInput
                  error={actionData?.errors.lastname}
                  name="lastname"
                  type="text"
                  title="Pavardė"
                />
                <CustomInput
                  error={actionData?.errors.username}
                  name="username"
                  type="text"
                  title="Slapyvardis"
                />
                <CustomInput
                  error={actionData?.errors.secretCode}
                  name="secretCode"
                  type="text"
                  title="Pakvietimo kodas"
                />
                <CustomInput
                  error={actionData?.errors.email}
                  name="email"
                  type="text"
                  title="El. pašto adresas"
                />
                <CustomInput
                  error={actionData?.errors.password}
                  name="password"
                  type="password"
                  title="Slaptažodis"
                />
                {actionData?.errors?.existingUser ? (
                  <div
                    className="font-bold text-red-400"
                    id="existing-user-error"
                  >
                    {actionData.errors.existingUser}
                  </div>
                ) : actionData?.errors?.wrongSecretCode ? (
                  <div
                    className="font-bold text-red-400"
                    id="wrongsecrted-code-error"
                  >
                    {actionData.errors.wrongSecretCode}
                  </div>
                ) : null}

                <div className="button-container flex flex-col pt-10 justify-center items-center w-full">
                  <button
                    type="submit"
                    className="w-2/4 rounded-3xl bg-custom-850 px-2 py-3 text-white hover:bg-custom-800"
                  >
                    Prisiregistruoti
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
