import { Link } from "@remix-run/react";
import { useUser } from "~/utils";

interface NavBarHeaderProps {
  title: string;
}

export default function NavBarHeader({ title }: NavBarHeaderProps) {
  const user = useUser();
  return (
    <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center mb-3">
      <div className="flex items-center justify-between">
        <div className="pt-6 pl-6 pb-6">
          <h1 className="text-2xl text-bold font-bold">{title}</h1>
        </div>

        <div className="flex items-center text-1xl text-bold font-bold pr-6">
          <div className="flex items-center text-1xl text-bold font-bold pr-6">
            <Link to="/dashboard" className="btn btn-primary">
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
