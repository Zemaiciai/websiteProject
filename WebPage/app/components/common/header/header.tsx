

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropdownMenu from "~/components/common/navMenu/navMenu";
import navbarIcon from "~/pictures/navMenu/navMenuIcon.png"; 

interface HeaderProps {
  title: string;
  profilePictureSrc: string; 
  profileLink: string; 
}

const Header: React.FC<HeaderProps> = ({ title, profilePictureSrc, profileLink }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-cyan-500 to-blue-500 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <button className="text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              
              <img src={navbarIcon} alt="Navbar Icon" className="h-8 w-8" />
            </button>
            <DropdownMenu isOpen={isOpen} style={{ width: '200px'}} />
          </div>
          
          <Link to="/">
            <h1 className="text-white text-2xl font-bold cursor-pointer">{title}</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
         
          <Link to={profileLink}>
            <img src={profilePictureSrc} alt="Profile" className="h-10 w-10 rounded-full cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;

