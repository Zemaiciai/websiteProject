import { User } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { useUser } from "~/utils";

interface UserInfoProps {
  user: User | null;
  checkPendingStatusRequesteer: boolean;
  checkPendingStatusRequested: boolean;
  CurrentlyFriends: boolean;
}
function UserRatingAndOther({
  user,
  checkPendingStatusRequesteer,
  checkPendingStatusRequested,
  CurrentlyFriends,
}: UserInfoProps) {
  const [showPopup, setShowPopup] = useState(false);
  const realUser = useUser();
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const isUserInProfile = () => {
    // Check if the user is in their profile
    return user?.id === realUser.id; // Assuming user ID is used for identification
  };
  return (
    <div className="otherInfoDiv flex space-x-4 place-items-center">
      <div className="ratingsDiv">
        <h1 className="text-base font-semibold text-neutral-600">Rating</h1>
        <div className="flex items-center mt-[8px]">
          <svg
            className="w-4 h-4 text-custom-800 me-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg
            className="w-4 h-4 text-custom-800 me-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg
            className="w-4 h-4 text-custom-800 me-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg
            className="w-4 h-4 text-custom-800 me-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg
            className="w-4 h-4 text-gray-300 me-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <a
            href="link"
            className="text-sm font-medium text-neutral-600 underline hover:no-underline pl-[10px]"
          >
            148 reviews
          </a>
        </div>
      </div>
      {!isUserInProfile() && (
        <div className="buttonDiv flex place-items-end">
          <Form method="get" className="reportButton flex">
            <button
              className="text-base font-semibold text-neutral-600 hover:text-neutral-800"
              onClick={togglePopup}
            >
              Report user
            </button>
          </Form>
          {showPopup ? (
            <div className="fixed inset-0 w-screen flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="bg-white p-8 rounded-lg shadow-md text-center w-[30%] h-[40%]">
                <div className="flex items-center mb-4">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Reason
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Reason
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Reason
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default-radio-1"
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Other
                  </label>
                </div>
                <div className="input flex items-center mt-2">
                  <textarea
                    name="otherinfo"
                    id="otherinfo"
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:border-blue-500 w-full p-2.5 h-[100px] focus:outline-none "
                    placeholder="Papildoma informacija"
                  />
                </div>
                <div className="mt-4 space-x-4 flex">
                  <button
                    className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition duration-300 ease-in-out"
                    onClick={togglePopup}
                  >
                    Report
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition duration-300 ease-in-out"
                    onClick={togglePopup}
                  >
                    Uždaryti
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          <Form
            method="get"
            className="sendMessageButton flex space-x-1 place-items-center ml-4"
          >
            <img
              className="w-5 h-5 flex mt-[6px]"
              src="https://icones.pro/wp-content/uploads/2021/05/icone-de-chat-gris.png"
              alt="error"
            ></img>
            <button className="text-base font-semibold text-neutral-600 hover:text-neutral-800">
              Send Message
            </button>
          </Form>
          {/* Friends */}
          {!isUserInProfile() &&
            !checkPendingStatusRequesteer &&
            !checkPendingStatusRequested &&
            !CurrentlyFriends && (
              <Form
                method="post"
                className="flex space-x-1 place-items-center ml-4"
              >
                <input name="form-id" hidden defaultValue="sendInvite" />
                <input name="whoSentInvite" hidden defaultValue={realUser.id} />
                <input name="whoGotInvite" hidden defaultValue={user?.id} />
                <button
                  type="submit"
                  className="text-base font-semibold text-neutral-600 hover:text-neutral-800"
                >
                  Pridėti į draugus!
                </button>
              </Form>
            )}
          {!isUserInProfile() && checkPendingStatusRequesteer && (
            <Form
              method="post"
              className="flex space-x-1 place-items-center ml-4"
            >
              <input name="form-id" hidden defaultValue="cancelInvite" />
              <input name="whoSentInvite" hidden defaultValue={realUser.id} />
              <input name="whoGotInvite" hidden defaultValue={user?.id} />
              <button
                type="submit"
                className="text-base font-semibold text-neutral-600 hover:text-neutral-800"
              >
                Atšaukti pakvietimą
              </button>
            </Form>
          )}
          {/* ACCEPTING, DECLINE */}
          {!isUserInProfile() && checkPendingStatusRequested && (
            <Form
              method="post"
              className="flex space-x-1 place-items-center ml-4"
            >
              <input name="form-id" hidden defaultValue="acceptInvite" />
              <input name="whoSentInvite" hidden defaultValue={realUser.id} />
              <input name="whoGotInvite" hidden defaultValue={user?.id} />
              <button
                type="submit"
                className="text-base font-semibold text-neutral-600 hover:text-neutral-800"
              >
                Priimti pakvietimą
              </button>
            </Form>
          )}
          {!isUserInProfile() && checkPendingStatusRequested && (
            <Form
              method="post"
              className="flex space-x-1 place-items-center ml-4"
            >
              <input name="form-id" hidden defaultValue="rejectInvite" />
              <input name="whoSentInvite" hidden defaultValue={realUser.id} />
              <input name="whoGotInvite" hidden defaultValue={user?.id} />
              <button
                type="submit"
                className="text-base font-semibold text-neutral-600 hover:text-neutral-800"
              >
                Atšaukti pakvietimą
              </button>
            </Form>
          )}
          {/* IF YOU ARE FRIENDS */}
          {!isUserInProfile() && CurrentlyFriends && (
            <Form
              method="post"
              className="flex space-x-1 place-items-center ml-4"
            >
              <input name="form-id" hidden defaultValue="removeFromFriends" />
              <input name="whoSentInvite" hidden defaultValue={realUser.id} />
              <input name="whoGotInvite" hidden defaultValue={user?.id} />
              <button
                type="submit"
                className="text-base font-semibold text-neutral-600 hover:text-neutral-800"
              >
                Išmesti iš draugų
              </button>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}

export default UserRatingAndOther;
