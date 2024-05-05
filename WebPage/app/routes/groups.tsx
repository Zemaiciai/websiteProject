import { MetaFunction, Outlet } from "@remix-run/react";
export const meta: MetaFunction = () => [{ title: "Žemaičiai" }];

export default function Groups() {
  return (
    <div className="flex grow m-4">
      <Outlet />
    </div>
  );
}
