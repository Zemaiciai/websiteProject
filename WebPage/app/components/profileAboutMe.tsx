import React, { useState } from "react";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

const ProfileAboutMe = ({ initialBio }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(initialBio);

  const handleEditBio = () => {
    setIsEditing(!isEditing);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  return (
    <div className="biodiv max-w-screen-md w-full px-4">
      <Form className="flex justify-end">
        <button
          className="inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-200 "
          onClick={handleEditBio}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
          </svg>
        </button>
      </Form>

      {isEditing ? (
        <textarea
          className="mt-4 w-full h-24 bg-gray-100 rounded-md p-2 focus:outline-none"
          value={bio}
          onChange={handleBioChange}
        ></textarea>
      ) : (
        <p className="mt-4 h-40 rounded border-2 border-grey">{bio}</p>
      )}
    </div>
  );
};

export default ProfileAboutMe;
