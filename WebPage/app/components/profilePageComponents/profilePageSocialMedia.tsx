import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

function ProfilePageSocialMedia() {
  return (
    <div className="socialMediaDiv">
      <div className="p-4 md:p-5">
        <form className="space-y-4" action="#">
          <div>
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
                type="email"
                name="email"
                id="email"
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
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="twitter.com/profile/"
              />
            </div>
          </div>
        </form>
      </div>
      <button className="text-base font-semibold text-neutral-600 rounded border border-gray-400 w-20 h-8 hover:bg-gray-100 hover:text-gray-900">
        Save
      </button>
    </div>
  );
}
export default ProfilePageSocialMedia;
