import { PrismaClient } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { useState } from "react";

import Header from "~/components/common/header/header";
import { getNoteListItems } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

const prisma = new PrismaClient();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
};

const generateRandomSecretCode = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

async function createCode(customName, emailAdress) {
  const secretCode = generateRandomSecretCode(10);
  const hashedSecretCode = await bcrypt.hash(secretCode, 10);
  const currentDate = new Date();
  await prisma.secretCode.create({
    data: {
      hash: hashedSecretCode,
      email: emailAdress,
      ExpirationDate: new Date(currentDate.getTime() + 60 * 60 * 60 * 1000),
      Used: false
    }
  });
}

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("InviteCode");
  const user = useUser();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const customName = formData.get("customName") as string;
    const emailAdress = formData.get("emailAdress") as string;
    createCode(customName, emailAdress);
  };

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

          <button className="inline-flex justify-center px-4 py-3  hover:text-gray-900 bg-gray-50 hover:bg-gray-200 w-full">
            Users
          </button>

          <button className="inline-flex justify-center px-4 py-3  hover:text-gray-900 bg-gray-50 hover:bg-gray-200 w-full">
            Reports
          </button>

          <button className="inline-flex justify-center px-4 py-3  hover:text-gray-900 bg-gray-50 hover:bg-gray-200 w-full">
            Admin statistics
          </button>
        </div>

        {activeTab === "Dashboard" ? (
          <>
            <div className="p-6 bg-gray-100 text-medium dark:text-gray-1000 dark:bg-gray-300 w-full h-[400px] ml-3 mt-3 mr-3">
              {/* Dashboard content */}
            </div>
          </>
        ) : null}

        {activeTab === "Users" ? (
          <>
            <div className="p-6 bg-gray-100 text-medium dark:text-gray-1000 dark:bg-gray-300 w-full h-[400px] ml-3 mt-3 mr-3">
              {/* Dashboard content */}
            </div>
          </>
        ) : null}

        {activeTab === "InviteCode" ? (
          <>
            <div className="p-6 bg-gray-200 text-medium dark:text-gray-1000 dark:bg-gray-1000 w-full h-[400px] ml-3 mt-3 mr-3">
              <h1 className="text-3xl font-mono font-font-extralight">
                Pakvietimo kodo generavimas
              </h1>

              <form onSubmit={handleSubmit}>
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
                <button type="submit">Submit</button>
              </form>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
