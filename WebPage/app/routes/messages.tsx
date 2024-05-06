import { MetaFunction, Outlet } from "@remix-run/react";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];

const Dashboard = () => {
  return (
    <div className="flex h-full">
      <Outlet />
    </div>
  );
};

export default Dashboard;
