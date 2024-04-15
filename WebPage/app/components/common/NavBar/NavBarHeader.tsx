import { Form, Link } from "@remix-run/react";
import { useState } from "react"; // Import useState hook to manage state
import { useUser } from "~/utils";

interface NavBarHeaderProps {
  title: string;
}

export default function NavBarHeader({ title }: NavBarHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const user = useUser();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

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
              onClick={() => setIsDropdownOpen((prev) => !prev)}
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
                className="absolute mt-24 ml-28 bg-white divide-y divide-gray-100 border-gray-500 border rounded shadow"
                style={{ transform: "translateY(8px)" }}
              >
                <Form action={"/profile/" + user.id} method="get">
                  <button
                    type="submit"
                    className="block w-full py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    Profile
                  </button>
                </Form>
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className="block w-full py-2 px-4 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none"
                  >
                    Sign Out
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
