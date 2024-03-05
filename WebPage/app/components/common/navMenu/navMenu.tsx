import React from 'react';
import { Link } from 'react-router-dom';

interface NavMenu {
  isOpen: boolean;
  style?: React.CSSProperties; 
}

const NavMenu: React.FC<NavMenu> = ({ isOpen, style }) => {
  return (
    <div className={`absolute top-12 right--10 bg-white shadow-md ${isOpen ? 'block' : 'hidden'}`} style={style}>
        <ul className="p-2 space-y-5 text-lg py-4"> 
          <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>
  );
}

export default NavMenu;
