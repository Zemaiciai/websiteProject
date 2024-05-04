import { Form, Link } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";

import { useOptionalUser } from "~/utils";
import Notifications from "./Notifications";
import { Notification } from "@prisma/client";

interface NavBarHeaderProps {
  title: string;
}

export default function NavBarHeader({ title }: NavBarHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const user = useOptionalUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [notificationsRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
      <div className="flex items-center justify-between">
        <div className="pt-6 pl-6 pb-6">
          <h1 className="text-2xl text-bold font-bold">{title}</h1>
        </div>
        <div className="flex items-center text-1xl text-bold font-bold pr-6 space-x-4">
          <div className="flex items-center text-1xl text-bold font-bold">
            <Link to={"/profile/" + user?.id} className="btn btn-primary">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "0.5rem" }}>
                  {user?.firstName + " " + user?.lastName}
                </span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  alt="Profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                />
              </div>
            </Link>
            <button
              id="hs-dropdown-with-dividers"
              className=""
              type="button"
              onClick={toggleDropdown}
            >
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isDropdownOpen ? (
              <div
                ref={dropdownRef}
                className="absolute mt-32 ml-20 bg-white divide-y divide-gray-100 border-custom-800 border rounded shadow"
                style={{ transform: "translateY(8px)", minWidth: "10rem" }} // Set a minimum width for the dropdown
              >
                <Form action={"/profile/" + user?.id} method="get">
                  <button
                    type="submit"
                    className="block w-full py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    Profilis
                  </button>
                </Form>
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className="block w-full py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    Atsijungti
                  </button>
                </Form>
              </div>
            ) : null}
          </div>
          <div className="relative" ref={notificationsRef}>
            <img
              className="w-5 h-5 flex items-center cursor-pointer"
              src="https://cdn1.iconfinder.com/data/icons/100-basic-for-user-interface/32/94-bell-256.png"
              alt="sugedo"
              onClick={handleNotificationsClick}
            />
            {showNotifications && <Notifications />}
          </div>
          <Link to="/dashboard" className="btn btn-primary">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "0.5rem" }}>Grįžti atgal</span>
              <img
                className="w-4 h-4"
                src="https://cdn-icons-png.flaticon.com/512/13/13964.png"
                alt="ggwp"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
