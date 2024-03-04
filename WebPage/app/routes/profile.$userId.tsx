import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import Header from "~/components/common/header/header";
import ProfilePageTabs from "~/components/profilePageTabs";
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
      <Header
        title="My Website"
        profilePictureSrc="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
        profileLink={"/profile/" + user.id}
      />
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
