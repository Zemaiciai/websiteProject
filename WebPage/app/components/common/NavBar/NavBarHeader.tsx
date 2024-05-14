import { Form, Link, useNavigate } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";

import { useOptionalUser, useUser } from "~/utils";
import Notifications from "./Notifications";
import { Notification, User } from "@prisma/client";
import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "~/root";

interface NavBarHeaderProps {
  title: string;
}

export default function NavBarHeader({ title }: NavBarHeaderProps) {
  const { allUsers } = useTypedLoaderData<typeof loader>();
  let currentUser = useOptionalUser();
  const [searchQueryAllUsers, setSearchQueryAllUsers] = useState("");
  let filteredUsers: User[] | undefined;

  filteredUsers = allUsers?.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQueryAllUsers.toLowerCase()) &&
      user.id !== currentUser?.id,
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);
  const navigate = useNavigate();
  const handleUserNameClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setShowSearchResult(false);
  };
  const [showSearchResult, setShowSearchResult] = useState(false);
  const handeShowSearchResult = () => {
    setShowSearchResult(true);
  };
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResult(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
      <div className="flex items-center justify-between">
        <div className="pt-6 pl-6 pb-6">
          <h1 className="text-2xl text-bold font-bold">{title}</h1>
        </div>

        <div className="flex items-center text-1xl text-bold pr-6 space-x-4">
          <div className="flex items-center h-10 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border border-grey-200">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
              type="text"
              id="search"
              autoComplete="off"
              onClick={handeShowSearchResult}
              placeholder="Ieškoti vartotojo"
              value={searchQueryAllUsers}
              onChange={(e) => setSearchQueryAllUsers(e.target.value)}
            />
          </div>
          <div className="relative" ref={searchRef}>
            {filteredUsers != undefined &&
            filteredUsers.length > 0 &&
            showSearchResult ? (
              <ul className="absolute max-h-72 w-[15.375rem] right-4 top-7 bg-custom-200 drop-shadow-lg rounded p-4 overflow-auto">
                {filteredUsers.map((user, _) => (
                  <>
                    <li
                      onClick={() => handleUserNameClick(user.id)}
                      className="cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between items-center border border-gray-100 mt-1"
                    >
                      <span className="truncate mr-2">{user.userName}</span>
                      <span className="text-sm text-nowrap">{user.role}</span>
                    </li>
                  </>
                ))}
              </ul>
            ) : (
              searchQueryAllUsers.length > 0 &&
              showSearchResult && (
                <ul className="absolute max-h-72 w-[15.375rem] right-4 top-7 bg-custom-200 drop-shadow-lg rounded p-4 overflow-auto">
                  <span>Tokio vartotojo nėra</span>
                </ul>
              )
            )}
          </div>
          <div className="flex items-center text-1xl text-bold font-bold">
            <Link
              to={"/profile/" + currentUser?.id}
              className="btn btn-primary"
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "0.5rem" }}>
                  {currentUser?.firstName + " " + currentUser?.lastName}
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
              <div className="relative" ref={dropdownRef}>
                <div
                  className="absolute right-0 top-4 bg-white divide-y divide-gray-100 border-custom-800 border rounded shadow"
                  style={{ transform: "translateY(8px)", minWidth: "10rem" }} // Set a minimum width for the dropdown
                >
                  <Form action={"/profile/" + currentUser?.id} method="get">
                    <button
                      type="submit"
                      className="block w-full py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                    >
                      Profilis
                    </button>
                  </Form>
                  {currentUser?.role.toLocaleLowerCase() === "super admin" && (
                    <Form action={"/admin"} method="get">
                      <button
                        type="submit"
                        className="block w-full py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                      >
                        Admin panel
                      </button>
                    </Form>
                  )}
                  <Form action="/logout" method="post">
                    <button
                      type="submit"
                      className="block w-full py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                    >
                      Atsijungti
                    </button>
                  </Form>
                </div>
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
        </div>
      </div>
    </div>
  );
}
