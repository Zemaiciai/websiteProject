import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  Link
} from "@remix-run/react";
import React, { useState } from "react";

import ProfileSettings from "~/components/profileSettings";
import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

import ProfileAboutMe from "./../components/profileAboutMe";
import ProfileCard from "./../components/profileCard";
import Join from "./join";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

export default function NoteDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const user = useUser();
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const data = useLoaderData<typeof loader>();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("Sample Bio"); // Initial bio content

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleSaveBio = () => {
    setIsEditingBio(false);
    // You can add code here to save the updated bio to your backend or perform any other actions
  };

  const handleCancelEditBio = () => {
    setIsEditingBio(false);
    // You might want to reset the bio content or perform any other actions when cancelling edit
  };

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
