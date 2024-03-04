import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import React, { useState } from "react";

import { requireUser } from "~/session.server";

import ProfilePageEditDropBox from "./../components/profilePageEditDropBox";
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

export default function ProfileCard() {
  const [selectedImage, setSelectedImage] = useState(null);

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
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profileCardDiv w-full h-full static">
      <div className="backGroundPhoto w-full h-[285px] bg-gradient-to-r from-sky-300 to-zinc-600 shadow-xl"></div>
      <div className="infoDiv w-full h-[200px] flex">
        <div className="info max-w-[800px] h-full">
          <h1 className="text-4xl font-semibold pl-96 pt-6 font-serif w-[800px]">
            Vardas Pavardė
          </h1>
          <div className="role pt-3 flex space-x-2 pl-[400px] w-[800px]">
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/celestial-phenomena/role-8.png"
              alt="Social Media 1"
              className="w-6 h-6"
            />
            <h2 className="text-base font-semibold text-sky-500 w-[800px]">
              ROLE
            </h2>
          </div>
          <div className="gmail pt-3 flex space-x-2 pl-[400px] w-[800px]">
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-gmail-1664136-1412959.png"
              alt="Social Media 1"
              className="w-6 h-6"
            />
            <h3 className="text-base font-semibold text-sky-500 w-[800px]">
              {data.user.email}
            </h3>
          </div>

          <div className="socialMediaLinks pt-3 flex space-x-4 pl-[400px] w-[800px]">
            <a
              href="your-social-media-link-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png"
                alt="Social Media 1"
                className="w-6 h-6"
              />
            </a>
            <a
              href="your-social-media-link-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://i.pinimg.com/originals/ce/d6/6e/ced66ecfc53814d71f8774789b55cc76.png"
                alt="Social Media 2"
                className="w-6 h-6"
              />
            </a>
            <a
              href="your-social-media-link-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-black-icon.png"
                alt="Social Media 2"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>
        <div className="otherInfo w-[700px]">
          <h1 className="text-base font-semibold text-neutral-600 mt-[75px]">
            Rating
          </h1>
          <div className="flex items-center mt-[8px]">
            <svg
              className="w-4 h-4 text-sky-500 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-sky-500 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-sky-500 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-sky-500 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <a
              href="#"
              className="text-sm font-medium text-neutral-600 underline hover:no-underline dark:text-white pl-[10px]"
            >
              148 reviews
            </a>
            <Form method="get" className="reportButton">
              <button className="text-base font-semibold text-neutral-600 pl-[50px]">
                Report user
              </button>
            </Form>
            <Form
              method="get"
              className="sendMessageButton flex space-x-1 pl-[30px] "
            >
              <img
                className="w-5 h-5 flex mt-[6px]"
                src="https://icones.pro/wp-content/uploads/2021/05/icone-de-chat-gris.png"
                alt="error"
              ></img>
              <button className="text-base font-semibold text-neutral-600">
                Send Message
              </button>
            </Form>
          </div>
        </div>
        <ProfilePageEditDropBox />
        {/* <Form
          method="get"
          className="editButton flex justify-end pt-[60px] pr-[50px] w-[450px]"
        >
          <button
            className="inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-200 "
            onClick={handleEditBio}
          >
            <img
              className="w-6 h-6 fill-current"
              src="https://cdn3.iconfinder.com/data/icons/navigation-and-settings/24/Material_icons-01-13-512.png"
            ></img>
          </button>
        </Form> */}
      </div>
      <div className="profileImageDiv rounded-full absolute top-[210px] left-[120px] outline-4 outline-white outline shadow-xl">
        <img
          className="rounded-full"
          src="data:image/png;base64,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"
          alt="Contact Person"
          width={230}
          height={230}
        />
      </div>
    </div>

    /*<div className="container max-w-md p-8 bg-white rounded-lg shadow-lg  mt-20 ml-20">
      <Form method="get" className="flex justify-end">
        <button
          className="inline-flex items-center justify-center w-10 h-10 mr-2 text-gray-700 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-gray-200 "
          onClick={handleEditBio}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
          </svg>
        </button>
      </Form>
      <img
        src="data:image/png;base64,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"
        alt="Profile Picture"
        className="w-32 h-32 rounded-full mx-auto mb-8"
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">John Doe</h1>
        <h2 className="text-lg text-gray-600">Web Developer</h2>
      </div>
      <div className="mt-6">
        <p className="text-gray-700 text-start space-x-4">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/017/608/909/small/e-mail-icon-mail-envelope-service-contact-message-sending-send-email-icon-e-mail-address-vector.jpg"
            alt="Social Media 1"
            className="w-16 h-16"
          />
          {data.user.email}
        </p>
        <div className="gmail flex space-x-0.5 place-items-center ">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/017/608/909/small/e-mail-icon-mail-envelope-service-contact-message-sending-send-email-icon-e-mail-address-vector.jpg"
            alt="Social Media 1"
            className="w-16 h-16"
          />
          <label className="text">{data.user.email}</label>
        </div>
        <div className="relative z-0">
          <input
            type="text"
            id="disabled_standard"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            disabled
          />
          <label
            //for="disabled_standard"
            className="absolute text-sm text-gray-400 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            <span className="font-semibold">Joined:</span> January 1, 2022
          </label>
        </div>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <a
          href="your-social-media-link-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.freepik.com/premium-vector/instagram-app-icon-social-media-logo-vector-illustration_277909-403.jpg"
            alt="Social Media 1"
            className="w-7 h-7"
          />
        </a>
        <a
          href="your-social-media-link-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://i.pinimg.com/originals/ce/d6/6e/ced66ecfc53814d71f8774789b55cc76.png"
            alt="Social Media 2"
            className="w-7 h-7"
          />
        </a>
      </div>
    </div>*/
  );
}
