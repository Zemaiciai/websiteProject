import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React, { useState, useRef } from "react";

import { requireUser } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

function ProfilePageSocialMedia() {
  const modalRef = useRef<HTMLDivElement>(null); // explicitly define the type of modalRef

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("hidden");
      //modalRef.current.style.position = "fixed"; // Make the modal fixed position
      //modalRef.current.style.top = "50%"; // Align the modal vertically in the middle
      //modalRef.current.style.left = "50%"; // Align the modal horizontally in the middle
      //modalRef.current.style.transform = "translate(-50%, -50%)"; // Center the modal
      modalRef.current.style.backgroundColor = "rgba(0, 0, 0, 0.4)"; // Add a dark overlay background
      //modalRef.current.style.padding = "20px"; // Add padding to the modal content
      //modalRef.current.style.borderRadius = "10px"; // Add border radius to the modal
      //modalRef.current.style.zIndex = "9999"; // Increase the z-index to make it appear on top of other elements
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.add("hidden");
    }
  };

  return (
    <div className="socialMediaDiv">
      <button
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700"
        type="button"
        onClick={openModal}
      >
        Social Media
      </button>

      <div
        id="authentication-modal"
        tabIndex={-1}
        aria-labelledby="modal-title"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        ref={modalRef}
      >
        <div className="relative p-4 w-full max-w-md max-h-full mt-[250px] ml-[700px] ">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3
                id="modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Add your social media links
              </h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="twitter.com/profile/"
                    />
                  </div>
                </div>
                <div className="buttons flex w-full place-content-evenly">
                  <Form method="get" className="saveButton">
                    <button className="text-base font-semibold text-neutral-600 rounded border border-gray-400 w-20 h-8 hover:bg-gray-100 hover:text-gray-900">
                      Save
                    </button>
                  </Form>
                  <Form method="get" className="closeButton">
                    <button
                      className="text-base font-semibold text-neutral-600 rounded border border-gray-400 w-20 h-8 hover:bg-gray-100 hover:text-gray-900"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </Form>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePageSocialMedia;
