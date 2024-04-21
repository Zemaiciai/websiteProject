import { Form, Link } from "@remix-run/react";
import { useState, useEffect, useRef } from "react"; // Import useState and useEffect hooks
import { useUser } from "~/utils";

interface NavBarHeaderProps {
  title: string;
}

export default function NavBarHeader({ title }: NavBarHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const user = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to the dropdown menu element

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false); // Close dropdown if the click is outside of it
      }
    };

    // Attach event listener when the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Remove event listener when the dropdown is closed
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener on component unmount
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
            <Link to={"/profile/" + user.id} className="btn btn-primary">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "0.5rem" }}>
                  {user.firstName + " " + user.lastName}
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
                  strokeLinecap="round" // Use camelCase for attributes
                  strokeLinejoin="round" // Use camelCase for attributes
                  strokeWidth="2" // Use camelCase for attributes
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            {isDropdownOpen ? (
              <div
                ref={dropdownRef}
                className="absolute mt-28 ml-20 bg-white divide-y divide-gray-100 border-gray-500 border rounded shadow"
                style={{ transform: "translateY(8px)", minWidth: "10rem" }} // Set a minimum width for the dropdown
              >
                <Form action={"/profile/" + user.id} method="get">
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
          <Link to="/notifications" className="btn btn-primary">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                className="w-5 h-5"
                src="https://cdn1.iconfinder.com/data/icons/100-basic-for-user-interface/32/94-bell-256.png"
                alt="sugedo"
              />
            </div>
          </Link>
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
