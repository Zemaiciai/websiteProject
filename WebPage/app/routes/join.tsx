import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useRef } from "react";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

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

  if (firstname === "null" || firstname === "") {
    errors.firstname = "Vardas privalomas";
  }
  if (lastname === "null" || lastname === "") {
    errors.lastname = "Pavardė privalomas";
  }
  if (username === "null" || username === "") {
    errors.username = "Slapyvardis privalomas";
  }
  if (!validateEmail(email)) {
    errors.email = "El. pašto adresas netinkamas";
  }
  if (password === "null" || password === "") {
    errors.password = "Slaptažodis privalomas";
  }
  if (password.length < 8) {
    errors.password = "Slaptažodis per trumpas";
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    errors.existingUser = "Vartotojas su tuo pačiu el. paštu jau egzistuoja";
  }

  const user = await createUser(
    email,
    password,
    firstname,
    lastname,
    secretCode
  );

  if (!user) {
    errors.wrongSecretCode = "Neteisingas pakvietimo kodas";
  }

  if (Object.keys(errors).length > 0 || !user) {
    return json({ errors }, { status: 400 });
  } else {
    return createUserSession({
      redirectTo,
      remember: false,
      request,
      userId: user.id
    });
  }
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const secretCodeRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex min-h-full flex-col justify-center h-14 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div
        className="mx-auto w-full max-w-md px-8 bg-sky-500 border border-white rounded-lg"
        style={{ borderWidth: "3px", paddingTop: "5vh", paddingBottom: "5vh" }}
      >
        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="firstname" className="block text-sm text-white">
              Vardas
            </label>
            <div className="mt-1">
              <input
                ref={firstnameRef}
                id="firstname"
                name="firstname"
                type="text"
                autoComplete="on"
                aria-invalid={actionData?.errors?.firstname ? true : undefined}
                aria-describedby="firstname-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {actionData?.errors?.firstname ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="firstname-error"
                >
                  {actionData.errors.firstname}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm text-white">
              Pavardė
            </label>
            <div className="mt-1">
              <input
                ref={lastnameRef}
                id="lastname"
                name="lastname"
                type="text"
                autoComplete="on"
                aria-invalid={actionData?.errors?.lastname ? true : undefined}
                aria-describedby="lastname-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {actionData?.errors?.lastname ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="lastname-error"
                >
                  {actionData.errors.lastname}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="username" className="block text-sm text-white">
              Slapyvardis
            </label>
            <div className="mt-1">
              <input
                ref={usernameRef}
                id="username"
                name="username"
                type="text"
                autoComplete="on"
                aria-invalid={actionData?.errors?.username ? true : undefined}
                aria-describedby="username-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {actionData?.errors?.username ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="username-error"
                >
                  {actionData.errors.username}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="secretCode" className="block text-sm text-white">
              Pakvietimo kodas
            </label>
            <div className="mt-1">
              <input
                ref={secretCodeRef}
                id="secretCode"
                name="secretCode"
                type="text"
                autoComplete="on"
                aria-invalid={
                  actionData?.errors?.secretCode ||
                  actionData?.errors.wrongSecretCode
                    ? true
                    : undefined
                }
                aria-describedby="secretCode-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {actionData?.errors?.secretCode ||
              actionData?.errors.wrongSecretCode ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="secretCode-error"
                >
                  {actionData.errors.secretCode ||
                    actionData?.errors.wrongSecretCode}
                </div>
              ) : null}
            </div>
          </div>

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

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
          >
            Sukurti paskyrą
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-white">
              Jau turite paskyrą?{" "}
              <Link
                className="text-grey underline hover:text-slate-300"
                to={{
                  pathname: "/login",
                  search: searchParams.toString()
                }}
              >
                Prisijungti
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
