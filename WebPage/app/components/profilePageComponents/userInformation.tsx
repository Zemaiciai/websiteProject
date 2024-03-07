import { useUser } from "~/utils";

import FacebookImage from "./socialMediaImages/facebook";
import InstagramImage from "./socialMediaImages/instagram";
import XImage from "./socialMediaImages/x";
function UserInfo() {
  const user = useUser();
  return (
    <div className="info h-full place-items-center">
      <h1 className="text-4xl font-semibold pl-96 pt-6 font-serif w-[800px]">
        {user.firstName + " " + user.lastName}
      </h1>
      <div className="role pt-3 flex space-x-2 pl-[400px] w-[800px]">
        <img
          src="https://icons.veryicon.com/png/o/miscellaneous/celestial-phenomena/role-8.png"
          alt="Social Media 1"
          className="w-6 h-6"
        />
        <h2 className="text-base font-semibold text-sky-500 w-[800px]">ROLE</h2>
      </div>
      <div className="gmail pt-3 flex space-x-2 pl-[400px] w-[800px]">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-gmail-1664136-1412959.png"
          alt="Social Media 1"
          className="w-6 h-6"
        />
        <h3 className="text-base font-semibold text-sky-500 w-[800px]">
          {user.email}
        </h3>
      </div>

      <div className="socialMediaLinks pt-3 flex space-x-4 pl-[400px] w-[800px]">
        <InstagramImage />
        <FacebookImage />
        <XImage />
      </div>
    </div>
  );
}

export default UserInfo;
