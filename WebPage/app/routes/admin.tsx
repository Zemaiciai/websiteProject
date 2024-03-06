import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";

import Header from "~/components/common/header/header";
import { createCode, getAllcodes } from "~/models/secretCode.server";
import { useUser } from "~/utils";

export const loader = async () => {
  const secretCodeList = getAllcodes;
  return json({ secretCodeList });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = String(formData.get("emailAdress"));
  const customName = String(formData.get("customName"));
  const contractNumber = String(formData.get("contractNumber"));
  const roleSelection = String(formData.get("roleSelection"));
  await createCode(customName, email, contractNumber, roleSelection);
  return null;
};

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const user = useUser();
  const data = useLoaderData<typeof loader>();
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    console.log(tab);
  };
  const emailRef = useRef<HTMLInputElement>(null);
  const customNameRef = useRef<HTMLInputElement>(null);
  const contractNumberRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header
        title="My Website"
        profilePictureSrc="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
        profileLink={"/profile/" + user.id}
      />

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "Dashboard"
                ? "text-gray-900 bg-gray-200"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
            } w-full`}
            onClick={() => handleTabClick("Dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "InviteCode"
                ? "text-gray-900 bg-gray-200"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
            } w-full`}
            onClick={() => handleTabClick("InviteCode")}
          >
            Invite Code
          </button>

          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "Users"
                ? "text-gray-900 bg-gray-200"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
            } w-full`}
            onClick={() => handleTabClick("Users")}
          >
            Users
          </button>

          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "Reports"
                ? "text-gray-900 bg-gray-200"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
            } w-full`}
            onClick={() => handleTabClick("Reports")}
          >
            Reports
          </button>

          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "adminStats"
                ? "text-gray-900 bg-gray-200"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
            } w-full`}
            onClick={() => handleTabClick("adminStats")}
          >
            Admin statistics
          </button>
        </div>

        {activeTab === "Dashboard" ? (
          <>
            <div className="flex flex-col w-full ml-3 mt-3 mr-8">
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Dashboard
                </h1>
              </div>
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Placeholder
                </h1>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Users" ? (
          <>
            <div className="flex flex-col w-full ml-3 mt-3 mr-8">
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Users
                </h1>
              </div>
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Placeholder
                </h1>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Reports" ? (
          <>
            <div className="flex flex-col w-full ml-3 mt-3 mr-8">
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Reports
                </h1>
              </div>
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Placeholder
                </h1>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "adminStats" ? (
          <>
            <div className="flex flex-col w-full ml-3 mt-3 mr-8">
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  adminStats
                </h1>
              </div>
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Placeholder
                </h1>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "InviteCode" ? (
          <>
            <div className="flex flex-col w-full ml-3 mt-3 mr-8">
              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Pakvietimo kodo generavimas
                </h1>

                <Form method="post">
                  <div>
                    <label
                      htmlFor="customName"
                      className="block text-sm text-black"
                    >
                      Pavadinimas
                    </label>
                    <div className="mt-1">
                      <input
                        id="customName"
                        name="customName"
                        type="text"
                        ref={customNameRef}
                        autoComplete="on"
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="emailAdress"
                      className="block text-sm text-black"
                    >
                      El. pašto adresas
                    </label>
                    <div className="mt-1">
                      <input
                        id="emailAdress"
                        name="emailAdress"
                        type="text"
                        ref={emailRef}
                        autoComplete="on"
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contractNumber"
                      className="block text-sm text-black"
                    >
                      Kontrakto numeris
                    </label>
                    <div className="mt-1">
                      <input
                        id="contractNumber"
                        name="contractNumber"
                        type="text"
                        ref={contractNumberRef}
                        autoComplete="on"
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="selectedTime"
                      className="block text-sm text-black"
                    >
                      Pasirinkti kodo galiojimą
                    </label>
                    <div className="mt-1">
                      <select
                        id="selectedTime"
                        name="selectedTime"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                      >
                        <option value="holder">Pasirinkti</option>
                        <option value="thirtyMinutes">30 minučių</option>
                        <option value="oneHour">1 valandai</option>
                        <option value="fifeHours">5 valandom</option>
                        <option value="twelveHours">12 valandų</option>
                        <option value="twentyForHours00">24 valandom</option>
                        <option value="oneWeek">1 savaitei</option>
                        <option value="oneMonth">1 mėnesiui</option>
                        <option value="threeMonths">3 mėnesiai</option>
                        <option value="sixMonths">6 mėnesiai</option>
                        <option value="nineMonths">9 mėnesiai</option>
                        <option value="oneYear">1 metai</option>
                        <option value="unlimited">Neribotas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="roleSelection"
                      className="block text-sm text-black"
                    >
                      Pasirinkti rolę
                    </label>
                    <div className="mt-1">
                      <select
                        id="roleSelection"
                        name="roleSelection"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                      >
                        <option value="holder">Pasirinkti</option>
                        <option value="worker">worker</option>
                        <option value="client">client</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit">Submit</button>
                </Form>
              </div>

              <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
                <h1 className="text-3xl font-mono font-font-extralight">
                  Sistemoje esantys pakvietimo kodai
                </h1>
                <div className="overflow-hidden">
                  <table className="min-w-full text-center text-sm font-light">
                    <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
                      <tr>
                        <th scope="col" className=" px-6 py-4">
                          #
                        </th>
                        <th scope="col" className=" px-6 py-4">
                          Pavadinimas
                        </th>
                        <th scope="col" className=" px-6 py-4">
                          El. paštas
                        </th>
                        <th scope="col" className=" px-6 py-4">
                          Rolė
                        </th>
                        <th scope="col" className=" px-6 py-4">
                          Kontrakto nr.
                        </th>
                        <th scope="col" className=" px-6 py-4">
                          Galiojimo data
                        </th>
                        <th scope="col" className=" px-6 py-4">
                          Panaudojimas
                        </th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>

                {/* <ol>
                  {data.secretCodeList.map((email) => (
                    <li key={email.id}>
                      <NavLink
                        className={({ isActive }) =>
                          `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                        }
                        to={email.id}
                      >
                        📝 {email.title}
                      </NavLink>
                    </li>
                  ))}
                </ol> */}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
