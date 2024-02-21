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

// THINGS HAVE TO BE ADDED FOR NEW SHIT LIKE FIRST,LAST NAME, USERNAME ETC
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const username = formData.get("username");
  const securitycode = formData.get("securitycode");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (typeof firstname !== "string" || firstname.length === 0) {
    return json(
      { errors: { email: null, firstname: "Vardas privalomas" } },
      { status: 400 }
    );
  }

  if (typeof lastname !== "string" || lastname.length === 0) {
    return json(
      { errors: { email: null, lastname: "Pavardė privalomas" } },
      { status: 400 }
    );
  }

  if (typeof username !== "string" || username.length === 0) {
    return json(
      { errors: { email: null, username: "Vardas privalomas" } },
      { status: 400 }
    );
  }

  if (typeof securitycode !== "string" || securitycode.length === 0) {
    return json(
      { errors: { email: null, securitycode: "Vardas privalomas" } },
      { status: 400 }
    );
  }

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "El. pašto adresas netinkamas", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Slaptažodis privalomas" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Slaptažodis per trumpas" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "Paskyra su tokiu el. paštu jau egzistuoja",
          password: null
        }
      },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id
  });
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
  const securitycodeRef = useRef<HTMLInputElement>(null);

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
            <label htmlFor="firstname" className="block text-sm text-white">
              Vardas
            </label>
            <div className="mt-1">
              <input
                ref={firstnameRef}
                id="firstname"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="firstname"
                type="firstname"
                // autoComplete="email"
                // aria-invalid={actionData?.errors?.email ? true : undefined}
                // aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {/* {actionData?.errors?.email ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="email-error"
                >
                  {actionData.errors.email}
                </div>
              ) : null} */}
            </div>
          </div>

          {/* THINGS HAVE TO BE FIXED?? IDK TAS KAS UZKOMENTUOTA */}
          <div>
            <label htmlFor="lastname" className="block text-sm text-white">
              Pavardė
            </label>
            <div className="mt-1">
              <input
                ref={lastnameRef}
                id="lastname"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="lastname"
                type="lastname"
                // autoComplete="email"
                // aria-invalid={actionData?.errors?.email ? true : undefined}
                // aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {/* {actionData?.errors?.email ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="email-error"
                >
                  {actionData.errors.email}
                </div>
              ) : null} */}
            </div>
          </div>

          {/* THINGS HAVE TO BE FIXED?? IDK TAS KAS UZKOMENTUOTA */}
          <div>
            <label htmlFor="username" className="block text-sm text-white">
              Slapyvardis
            </label>
            <div className="mt-1">
              <input
                ref={usernameRef}
                id="username"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="username"
                type="username"
                // autoComplete="email"
                // aria-invalid={actionData?.errors?.email ? true : undefined}
                // aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {/* {actionData?.errors?.email ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="email-error"
                >
                  {actionData.errors.email}
                </div>
              ) : null} */}
            </div>
          </div>

          {/* THINGS HAVE TO BE FIXED?? IDK TAS KAS UZKOMENTUOTA */}
          <div>
            <label htmlFor="securitycode" className="block text-sm text-white">
              Pakvietimo kodas
            </label>
            <div className="mt-1">
              <input
                ref={securitycodeRef}
                id="securitycode"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="securitycode"
                type="securitycode"
                // autoComplete="email"
                // aria-invalid={actionData?.errors?.email ? true : undefined}
                // aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
              />
              {/* {actionData?.errors?.email ? (
                <div
                  className="pt-1 font-bold text-yellow-200"
                  id="email-error"
                >
                  {actionData.errors.email}
                </div>
              ) : null} */}
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
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
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
                autoComplete="new-password"
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
