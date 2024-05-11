import { MetaFunction, Outlet } from "@remix-run/react";
export const meta: MetaFunction = () => [{ title: "Užsakymai - Žemaičiai" }];
export default function WorkPage() {
  return (
    <div className="flex grow m-1">
      <Outlet />
    </div>
  );
}
