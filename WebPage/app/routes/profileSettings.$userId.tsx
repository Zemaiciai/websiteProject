import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import ProfileSettings from "~/components/profileSettings";
import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

import ProfileCard from "./../components/profileCard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

export default function NoteDetailsPage() {
  const user = useUser();

  return (
    <div className="main-div">
      <header className="flex items-center bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Notes</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post" className="mr-10">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
        <Form
          action={"/profile/" + user.id}
          method="get"
          className="place-self-end ml-10"
        >
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Profile
          </button>
        </Form>
      </header>
      <div className="profilePageDiv">
        <ProfileCard />
        <ProfileSettings />
      </div>
    </div>
  );
}
