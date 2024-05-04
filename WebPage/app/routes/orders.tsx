import { MetaFunction, Outlet } from "@remix-run/react";
export const meta: MetaFunction = () => [{ title: "Užsakymai - Žemaičiai" }];
export default function WorkPage() {
  return (
    <div className="flex h-screen bg-custom-100">
      <main className="h-full w-full p-4 ">
        <Outlet />
      </main>
    </div>
  );
}
