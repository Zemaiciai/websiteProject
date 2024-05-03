import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { userInfo } from "os";
import { useState } from "react";
import {
  createSocialMedia,
  getSocialMediaByUserId,
} from "~/models/socialMedia.server";

import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

function ProfilePageSocialMedia() {
  const user = useUser();
  const [Clicked, setClicked] = useState(false);
  const handleTabClick = () => {
    setClicked(true);
  };
  return (
    <Form method="post">
      <div className="socialMediaDiv">
        <div className="p-4 md:p-5">
          <div className="space-y-4">
            <div>
              <input name="form-id" hidden defaultValue="socialMedia" />
              <input name="userid" hidden defaultValue={user.id} />
              <div className="igdiv flex space-x-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png"
                  alt="Social Media 1"
                  className="w-6 h-6"
                />
                <input
                  type="iglink"
                  name="iglink"
                  id="iglink"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="instagram.com/profile/"
                />
              </div>
              <div className="fbdiv flex space-x-2 mt-4">
                <img
                  src="https://i.pinimg.com/originals/ce/d6/6e/ced66ecfc53814d71f8774789b55cc76.png"
                  alt="Social Media 2"
                  className="w-6 h-6"
                />
                <input
                  type="fblink"
                  name="fblink"
                  id="fblink"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="facebook.com/profile/"
                />
              </div>
              <div className="xdiv flex space-x-2 mt-4">
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-black-icon.png"
                  alt="Social Media 2"
                  className="w-6 h-6"
                />
                <input
                  type="twlink"
                  name="twlink"
                  id="twlink"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="twitter.com/profile/"
                />
              </div>
            </div>
          </div>
        </div>
        {Clicked ? (
          <div className="pt-1 font-bold text-green-500">
            <p>Socialinių tinklų nuorodos sėkmingai išsaugotos</p>
          </div>
        ) : null}
        <button
          type="submit"
          onClick={handleTabClick}
          className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
        >
          Išsaugoti
        </button>
      </div>
    </Form>
  );
}
export default ProfilePageSocialMedia;
