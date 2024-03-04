import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useRef } from "react";

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

  console.log(errors);

  if (errors && Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  } else if (user) {
    return createUserSession({
      redirectTo,
      remember: remember === "on" ? true : false,
      request,
      userId: user.id
    });
  }
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/Dashboard";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex min-h-full flex-col justify-center h-14 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div
        className="mx-auto w-full max-w-md px-8 bg-sky-500 border border-white rounded-lg"
        style={{ borderWidth: "3px", paddingTop: "5vh", paddingBottom: "5vh" }}
      >
        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-white">
              El. pašto adresas
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="text"
                autoComplete="on"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {actionData?.errors?.email ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="email-error"
                >
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-white">
              Slaptažodis
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="on"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {actionData?.errors?.password ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="password-error"
                >
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>
          {actionData?.errors?.wrongCredentials ? (
            <div
              className="pt-1 font-bold text-yellow-200"
              id="wrongcredentials-error"
            >
              {actionData.errors.wrongCredentials}
            </div>
          ) : null}

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
          >
            Prisijungti
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-white"
              >
                Prisiminti mane
              </label>
            </div>
            <div className="text-center text-sm text-white">
              Neturite paskyros?{" "}
              <Link
                className="text-grey underline hover:text-slate-300"
                to={{
                  pathname: "/join",
                  search: searchParams.toString()
                }}
              >
                Registracija
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
