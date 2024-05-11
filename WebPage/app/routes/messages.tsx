import { MetaFunction, Outlet } from "@remix-run/react";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];

const Dashboard = () => {
  return (
    <div className="flex h-full m-1">
      <Outlet />
    </div>
  );
};

export default Dashboard;
