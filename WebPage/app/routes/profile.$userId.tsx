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
    </div>
  );
}
