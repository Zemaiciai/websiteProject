import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useState } from "react";

import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

import ProfilePageSocialMedia from "../profilePageSocialMedia";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};
function ProfilePageEditDropBox() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();
  return (
    <Form method="get" className="editButtonForm">
      <div className="hs-dropdown relative place-items-center	">
        <button
          id="hs-dropdown-with-dividers"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-200 "
        >
          <img
            className="w-6 h-6 fill-current"
            src="https://cdn3.iconfinder.com/data/icons/navigation-and-settings/24/Material_icons-01-13-512.png"
            alt=""
          ></img>
        </button>
        {isOpen ? (
          <div
            className="hs-dropdown-menu transition-[opacity,margin] duration min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 divide-y divide-gray-200 dark:bg-gray-800 dark:border dark:border-gray-700 dark:divide-gray-700"
            aria-labelledby="hs-dropdown-with-dividers"
          >
            <div className="py-2 first:pt-0 last:pb-0">
              <Form action={"/profileSettings/" + user.id} method="get">
                <button
                  type="submit"
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
                >
                  Account Settings
                </button>
              </Form>
              <ProfilePageSocialMedia />
            </div>

            <div className="py-2 first:pt-0 last:pb-0">
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
                >
                  Sign Out
                </button>
              </Form>
            </div>
          </div>
        ) : null}
      </div>
    </Form>
  );
}
export default ProfilePageEditDropBox;
