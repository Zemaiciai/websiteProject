import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, Link } from "@remix-run/react";
import React, { useState } from "react";

import ProfilePageTabs from "~/components/profilePageTabs";
import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

import ProfileCard from "./../components/profileCard";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
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
        <ProfilePageTabs />
      </div>

      {/* <div className="container2 mt-20 min-w-1000 w-100%">
        <h3 className="text-2xl font-semibold">About me</h3>
        {isEditingBio ? (
          <div>
            <textarea
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
            <div className="mt-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                onClick={handleSaveBio}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700">{bio}</p>
          </div>
        )}
      </div> */}
    </div>
  );
}
