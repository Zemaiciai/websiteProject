import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

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
  const firstName = String(formData.get("firstname"));
  const lastName = String(formData.get("lastname"));
  const userName = String(formData.get("username"));
  const secretCode = String(formData.get("secretCode"));
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  const errors: Errors = {};

  if (typeof firstName !== "string" || firstName.length === 0) {
    errors.firstname = "Vardas privalomas";
  }
  if (typeof lastName !== "string" || lastName.length === 0) {
    errors.lastname = "Pavardė privalomas";
  }
  if (typeof userName !== "string" || userName.length === 0) {
    errors.username = "Vardas privalomas";
  }
  if (typeof secretCode !== "string" || secretCode.length === 0) {
    errors.secretCode = "Pakvietimo kodas privalomas";
  }
  if (!validateEmail(email)) {
    errors.email = "El. pašto adresas netinkamas";
  }
  if (typeof password !== "string" || password.length === 0) {
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
    firstName,
    lastName,
    secretCode
  );

  if (!user) {
    errors.wrongSecretCode = "Neteisingas slaptas kodas";
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
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const secretCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center h-14 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div
        className="mx-auto w-full max-w-md px-8 bg-sky-500 border border-white rounded-lg"
        style={{ borderWidth: "3px", paddingTop: "5vh", paddingBottom: "5vh" }}
      >
        <Form method="post" className="space-y-6">
          {/* THINGS HAVE TO BE FIXED?? IDK TAS KAS UZKOMENTUOTA */}
          <div>
            <label htmlFor="firstName" className="block text-sm text-white">
              Vardas
            </label>
            <div className="mt-1">
              <input
                ref={firstNameRef}
                id="firstName"
                required
                name="firstName"
                type="firstName"
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

          {/* THINGS HAVE TO BE FIXED?? IDK TAS KAS UZKOMENTUOTA */}
          <div>
            <label htmlFor="lastName" className="block text-sm text-white">
              Pavardė
            </label>
            <div className="mt-1">
              <input
                ref={lastNameRef}
                id="lastName"
                required
                name="lastName"
                type="lastName"
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
            <label htmlFor="userName" className="block text-sm text-white">
              Slapyvardis
            </label>
            <div className="mt-1">
              <input
                ref={userNameRef}
                id="userName"
                required
                name="userName"
                type="userName"
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
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="secretCode"
                type="secretCode"
                autoComplete="on"
                aria-invalid={actionData?.errors?.secretCode ? true : undefined}
                aria-describedby="secretCode-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {actionData?.errors?.secretCode ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="secretCode-error"
                >
                  {actionData.errors.secretCode}
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
                required
                name="email"
                type="email"
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
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800 focus:bg-blue-400"
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
