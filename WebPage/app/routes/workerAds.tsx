import { MetaFunction, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];

const Dashboard = () => {
  return (
    <div className="w-full h-full flex flex-grow flex-col bg-custom-100 pb-3">
      <div className="flex justify-between overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
