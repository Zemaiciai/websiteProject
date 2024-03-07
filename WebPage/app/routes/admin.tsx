import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";

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

  const createdCode = await createCode(
    customName,
    email,
    contractNumber,
    roleSelection
  );
  const secretCode = createdCode ? createdCode.secretCode : null;
  return json({ secretCode });
  //return null;
};

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const user = useUser();
  const data = useLoaderData<typeof loader>();
  const [popupOpen, setPopupOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    console.log(tab);
  };
  const emailRef = useRef<HTMLInputElement>(null);
  const customNameRef = useRef<HTMLInputElement>(null);
  const contractNumberRef = useRef<HTMLInputElement>(null);
  const { secretCode } = action;

  return (
    <div className="flex h-full min-h-screen flex-col relative">
      {/* <Header
        title="My Website"
        profilePictureSrc="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
        profileLink={"/profile/" + user.id}
      /> */}

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r-2 border-black bg-custom-900">
          <div className="h-32 w-full flex justify-center items-center">
            <a href="/admin" className="text-4xl text-white">
              Admin
            </a>
          </div>
          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "Dashboard"
                ? "text-white bg-custom-850"
                : "text-white bg-custom-900 hover:bg-custom-850"
            } w-full`}
            onClick={() => handleTabClick("Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "InviteCode"
                ? "text-white bg-custom-850"
                : "text-white bg-custom-900 hover:bg-custom-850"
            } w-full`}
            onClick={() => handleTabClick("InviteCode")}
          >
            Invite Code
          </button>
          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "Users"
                ? "text-white bg-custom-850"
                : "text-white bg-custom-900 hover:bg-custom-850"
            } w-full`}
            onClick={() => handleTabClick("Users")}
          >
            Users
          </button>
          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "Reports"
                ? "text-white bg-custom-850"
                : "text-white bg-custom-900 hover:bg-custom-850"
            } w-full`}
            onClick={() => handleTabClick("Reports")}
          >
            Reports
          </button>
          <button
            className={`inline-flex justify-center px-4 py-3 ${
              activeTab === "adminStats"
                ? "text-white bg-custom-850"
                : "text-white bg-custom-900 hover:bg-custom-850"
            } w-full`}
            onClick={() => handleTabClick("adminStats")}
          >
            Admin statistics
          </button>
        </div>

        {activeTab === "Dashboard" ? (
          <>
            <div className="flex flex-col w-full relative">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Invite code
                      </h1>
                    </div>
                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <Link to="/dashboard" className="btn btn-primary">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "0.5rem" }}>
                            Grįžti atgal
                          </span>
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
                <div className="flex flex-col w-[98,3%] ml-3 mt-3 mr-8">
                  <div className="p-6 bg-custom-200 text-medium   w-full h-[450px] ml-3 mt-3 mr-3">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Dashboard
                    </h1>
                  </div>

                  <div className="p-6 bg-custom-200 text-medium   w-full h-[400px] ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Placeholder
                    </h1>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Users" ? (
          <>
            <div className="flex flex-col w-full relative">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Invite code
                      </h1>
                    </div>
                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <Link to="/dashboard" className="btn btn-primary">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "0.5rem" }}>
                            Grįžti atgal
                          </span>
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
                <div className="flex flex-col w-[98,3%] ml-3 mt-3 mr-8">
                  <div className="p-6 bg-custom-200 text-medium   w-full h-[450px] ml-3 mt-3 mr-3">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Users
                    </h1>
                  </div>

                  <div className="p-6 bg-custom-200 text-medium   w-full h-[400px] ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Placeholder
                    </h1>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Reports" ? (
          <>
            <div className="flex flex-col w-full relative">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Invite code
                      </h1>
                    </div>
                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <Link to="/dashboard" className="btn btn-primary">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "0.5rem" }}>
                            Grįžti atgal
                          </span>
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
                <div className="flex flex-col w-[98,3%] ml-3 mt-3 mr-8">
                  <div className="p-6 bg-custom-200 text-medium   w-full h-[450px] ml-3 mt-3 mr-3">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Reports
                    </h1>
                  </div>

                  <div className="p-6 bg-custom-200 text-medium   w-full h-[400px] ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Placeholder
                    </h1>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "adminStats" ? (
          <>
            <div className="flex flex-col w-full relative">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Invite code
                      </h1>
                    </div>
                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <Link to="/dashboard" className="btn btn-primary">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "0.5rem" }}>
                            Grįžti atgal
                          </span>
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
                <div className="flex flex-col w-[98,3%] ml-3 mt-3 mr-8">
                  <div className="p-6 bg-custom-200 text-medium   w-full h-[450px] ml-3 mt-3 mr-3">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Admin stats
                    </h1>
                  </div>

                  <div className="p-6 bg-custom-200 text-medium   w-full h-[400px] ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Placeholder
                    </h1>
                    <div className=""></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "InviteCode" ? (
          <>
            {/* HEADER FOR ADMIN PANEL */}
            <div className="flex flex-col w-full relative ">
              <div className="flex flex-col w-full bg-custom-100">
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Invite code
                      </h1>
                    </div>
                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <Link to="/dashboard" className="btn btn-primary">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "0.5rem" }}>
                            Grįžti atgal
                          </span>
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

                <div className="flex flex-col w-[98,3%] ml-3 mt-3 mr-8 ">
                  <div className="p-6 bg-custom-200 text-medium w-full h-[450px] ml-3 mt-3 mr-3">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Pakvietimo kodo generavimas
                    </h1>
                    <Form method="post">
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <label
                              htmlFor="customName"
                              className="text-sm text-black"
                            >
                              Pavadinimas
                            </label>
                            <div className="relative">
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
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <div className="flex flex-col">
                            <label
                              htmlFor="emailAdress"
                              className="text-sm text-black"
                            >
                              El. pašto adresas
                            </label>
                            <div className="relative">
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
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <label
                              htmlFor="contractNumber"
                              className="text-sm text-black"
                            >
                              Kontrakto numeris
                            </label>
                            <div className="relative">
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
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <div className="flex flex-col">
                            <label
                              htmlFor="selectedTime"
                              className="text-sm text-black"
                            >
                              Pasirinkti kodo galiojimą
                            </label>
                            <div className="relative">
                              <select
                                id="selectedTime"
                                name="selectedTime"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                              >
                                <option value="holder">Pasirinkti</option>
                                <option value="thirtyMinutes">
                                  30 minučių
                                </option>
                                <option value="oneHour">1 valandai</option>
                                <option value="fifeHours">5 valandom</option>
                                <option value="twelveHours">12 valandų</option>
                                <option value="twentyForHours00">
                                  24 valandom
                                </option>
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
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <label
                              htmlFor="roleSelection"
                              className="text-sm text-black"
                            >
                              Pasirinkti rolę
                            </label>
                            <div className="relative">
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
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded bg-blue-600 mt-5 px-2 py-2 text-white hover:bg-blue-800 transition duration-300 ease-in-out"
                        onClick={togglePopup}
                      >
                        Sukurti kodą
                      </button>

                      {popupOpen ? (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                          <div className="bg-white p-8 rounded-lg shadow-md">
                            <p id="secretCode">Generated Secret Code:</p>
                            <button
                              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              onClick={togglePopup}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </Form>
                  </div>

                  <div className="p-6 bg-custom-200 text-medium w-full h-[400px] ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Sistemoje esantys pakvietimo kodai
                    </h1>
                    <div className="">
                      <table className="min-w-full text-center text-sm font-light">
                        <thead className="border-b bg-neutral-50 font-medium ">
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
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
