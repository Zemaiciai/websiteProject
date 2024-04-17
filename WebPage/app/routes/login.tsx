import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import { CustomInput } from "~/components/common/CustomInput";

import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateLoginCredentials } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface Errors {
  email?: string;
  password?: string;
  wrongCredentials?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  const errors: Errors = {};
  const user = await validateLoginCredentials(email, password, errors);

  if (errors && Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  } else if (user) {
    return createUserSession({
      redirectTo,
      remember: remember === "on" ? true : false,
      request,
      userId: user.id,
    });
  }
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/Dashboard";
  const actionData = useActionData<typeof action>();

  return (
    <main className="w-screen h-screen bg-custom-100 overflow-auto">
      <div className="flex w-full h-full flex-col justify-center items-center">
        <div className="flex w-3/4 h-full my-4">
          <div className="flex relative justify-center items-center bg-custom-200 h-full w-2/3 rounded-l-2xl overflow-auto">
            <span className="absolute text-xl font-bold left-6 top-4">
              Žemaičiai
            </span>
            <div className="login-container flex flex-col pb-4 h-full w-2/3">
              <div className="text-container pt-20 text-center">
                <span className="text-3xl text-custom-850 font-extrabold flex justify-center items-center flex-col">
                  Prisijungimas
                  <hr className="border-2 mt-4 w-14 border-custom-850 rounded-2xl" />
                </span>
              </div>
              <ul className="logos-list pt-2 flex justify-center space-x-4 h-max w-full bg-white ">
                <li>Logo1</li>
                <li>Logo2</li>
                <li>Logo3</li>
              </ul>
              <span className="text-center pt-6 pb-4 text-xs text-gray-500">
                arba naudokite egzistuojančią paskyrą
              </span>
              <div className="flex flex-col bg-white w-full h-full px-10">
                <Form method="post" className="space-y-8">
                  <div className="space-y-8">
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
                    {actionData?.errors?.wrongCredentials ? (
                      <div
                        className="font-bold text-red-400"
                        id="wrong-credentials-error"
                      >
                        {actionData.errors.wrongCredentials}
                      </div>
                    ) : null}
                  </div>
                  <input type="hidden" name="redirectTo" value={redirectTo} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-5 w-5 border rounded border-grey-500 accent-custom-850"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 block font-medium"
                      >
                        Prisiminti mane
                      </label>
                    </div>
                    <div className="text-center font-medium">
                      <Link
                        className="hover:text-custom-800"
                        to={{
                          pathname: "/recover",
                          search: searchParams.toString(),
                        }}
                      >
                        Pamiršote slaptažodį?
                      </Link>
                    </div>
                  </div>
                  <div className="button-container flex flex-col justify-center pt-8 items-center w-full">
                    <button
                      type="submit"
                      className="w-2/4 rounded-3xl bg-custom-850 px-2 py-3 text-white hover:bg-custom-800"
                    >
                      Prisijungti
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center bg-custom-800 h-full w-1/3 rounded-r-2xl">
            <div className="text-container text-center">
              <span className="text-3xl text-white font-extrabold flex justify-center items-center flex-col">
                Neturi Paskyros?
                <hr className="border-2 mt-4 w-14 border-custom-850 rounded-2xl" />
              </span>
              <div className="button-container flex flex-col justify-center pt-8 items-center w-full">
                <Link
                  className="w-2/4 rounded-3xl border border-custom-850 px-2 py-3 text-white hover:bg-custom-850"
                  to="/join"
                >
                  Registruotis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
