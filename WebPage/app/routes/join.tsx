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
  const actionData = useActionData<typeof action>();

  return (
    <main className="w-screen h-screen bg-white-background bg-cover bg-center overflow-auto">
      <div className="flex w-full h-full flex-col justify-center items-center">
        <div className="flex w-2/3 h-full my-16">
          <div className="flex relative h-full w-2/3 bg-custom-200 rounded-l-2xl overflow-auto">
            <span className="absolute text-xl font-bold left-6 top-4">
              Žemaičiai
            </span>
            <div className="register-container flex flex-col justify-center py-6 px-44 h-full w-full">
              <div className="text-container text-center">
                <span className="text-3xl text-custom-850 font-extrabold flex justify-center items-center flex-col">
                  Registracija
                  <hr className="border-2 mt-4 w-14 border-custom-850 rounded-2xl" />
                </span>
              </div>
              <ul className="logos-list pt-2 flex justify-center space-x-4 h-max w-full bg-white ">
                <li>Logo1</li>
                <li>Logo2</li>
                <li>Logo3</li>
              </ul>
              <span className="text-center pt-6 pb-4 text-xs text-gray-500">
                arba sukurkite paskyrą
              </span>

              <Form method="post">
                <div className="space-y-4">
                  <CustomInput
                    name="firstname"
                    type="text"
                    title="Vardas"
                    error={actionData?.errors.firstname}
                  />
                  <CustomInput
                    name="lastname"
                    type="text"
                    title="Pavardė"
                    error={actionData?.errors.lastname}
                  />
                  <CustomInput
                    name="username"
                    type="text"
                    title="Slapyvardis"
                    error={actionData?.errors.username}
                  />
                  <CustomInput
                    name="secretCode"
                    type="text"
                    title="Pakvietimo kodas"
                    error={actionData?.errors.secretCode}
                  />
                  <CustomInput
                    name="email"
                    type="text"
                    title="El. paštas"
                    error={actionData?.errors.email}
                  />
                  <CustomInput
                    name="password"
                    type="password"
                    title="Slaptažodis"
                    error={actionData?.errors.password}
                  />
                </div>
                {actionData?.errors?.existingUser ? (
                  <div
                    className="font-bold text-red-400 m-0"
                    id="wrong-credentials-error"
                  >
                    {actionData.errors.existingUser}
                  </div>
                ) : null}
                {actionData?.errors?.wrongSecretCode ? (
                  <div
                    className="font-bold text-red-400 m-0"
                    id="wrong-secretCode-error"
                  >
                    {actionData.errors.wrongSecretCode}
                  </div>
                ) : null}
                <div className="button-container flex flex-col justify-center pt-6 items-center w-full">
                  <button
                    type="submit"
                    className="
                      rounded-3xl bg-custom-850 px-8 py-3 
                      transition duration-300 ease-in-out hover:bg-custom-800 
                      text-white"
                  >
                    Prisiregistruoti
                  </button>
                </div>
              </Form>
            </div>
          </div>
          <div className="flex relative bg-purple-background bg-cover bg-center justify-center items-center h-full w-1/3 rounded-r-2xl">
            <div className="text-container text-center">
              <span className="text-3xl text-white font-extrabold flex justify-center items-center flex-col">
                Turi Paskyrą?
                <hr className="border-2 mt-4 w-14 border-white-400 rounded-2xl" />
              </span>
              <div className="button-container flex flex-col justify-center pt-8 items-center w-full">
                <Link
                  className="
                  rounded-3xl border-2 border-custom-200 
                  transition duration-300 ease-in-out hover:bg-custom-850
                  px-8 py-3 text-white
                  "
                  to="/login"
                >
                  Prisijungti
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
