import { LoaderFunctionArgs, json } from "@remix-run/node";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { requireUser } from "~/session.server";

import navbarIcon from "../../../pictures/navMenu/navMenuIcon.png";
import NavMenu from "../navMenu/navMenu";

interface HeaderProps {
  title: string;
  profilePictureSrc: string;
  profileLink: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
};

const Header: React.FC<HeaderProps> = ({
  title,
  profilePictureSrc,
  profileLink,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img src={navbarIcon} alt="Navbar Icon" className="h-8 w-8" />
            </button>
            <NavMenu isOpen={isOpen} style={{ width: "200px" }} />
          </div>

          <Link to="/dashboard">
            <h1 className="text-white text-2xl font-bold cursor-pointer">
              {title}
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to={profileLink}>
            <img
              src={profilePictureSrc}
              alt="Profile"
              className="h-10 w-10 rounded-full cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
