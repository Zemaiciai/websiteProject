import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";

import { createCode, getAllcodes } from "~/models/secretCode.server";
import { getAllusers } from "~/models/user.server";
import { useUser } from "~/utils";

interface SecretCode {
  id: string;
  secretCode: string;
  customName: string;
  email: string;
  contractNumber: string;
  role: string;
  CreationData: Date;
  ExpirationDate: Date;
  Used: boolean;
}

interface Users {
  id: string;
  email: string;
  CreationDate: Date;
  UpdationDate: Date;
  firstName: string;
  lastName: string;
}

export const loader = async () => {
  const secretCodeList = await getAllcodes();
  return json({ secretCodeList });
};

export const loaderUsers = async () => {
  const userList = await getAllusers();
  return json({ userList });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = String(formData.get("emailAdress"));
  const customName = String(formData.get("customName"));
  const contractNumber = String(formData.get("contractNumber"));
  const roleSelection = String(formData.get("roleSelection"));
  const code = String(formData.get("selectedTime"));
  const createdCode = await createCode(
    customName,
    email,
    contractNumber,
    roleSelection,
    code
  );
  const secretCode = createdCode ? createdCode.secretCode : null;
  return json(secretCode);
  //return null;
};



export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const user = useUser();
  const data = useLoaderData<typeof loader>();
  const dataUsers = useLoaderData<typeof loaderUsers>();
  const [popupOpen, setPopupOpen] = useState(false);

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
  const deletetionEmailRef = useRef<HTMLInputElement>(null);

  // Move the declaration of secretCodeList here
  const loaderData = useLoaderData(); // No type provided
  const secretCodeList = (loaderData as { secretCodeList: SecretCode[] })
    .secretCodeList;
  const { secretCode } = action;

  // users list
  // const loaderDataForUsers = useLoaderData<typeof loaderUsers>();
  // const userList = (loaderDataForUsers as { userList: Users[] }).userList;
  // search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = secretCodeList
    .filter((code) =>
      code.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle input change and update the searchTerm state
  const handleSearch = (event) => {
    setCurrentPage(1); // Reset current page when searching
    setSearchTerm(event.target.value);
  };

  // Function to handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages based on filtered items
  const totalPages = Math.ceil(
    secretCodeList.filter((code) =>
      code.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / itemsPerPage
  );

  return (
    <div className="flex flex-grow h-screen flex-col relative">
      <main className="flex h-screen bg-white">
        <div className="flex flex-col flex-grow w-80 border-r-2 border-black bg-custom-900 h-screen overflow-auto">
          <div className="h-32 flex justify-center items-center">
            <a href="/admin" className="text-4xl text-white">
              Admin
            </a>
          </div>
          <div className="flex-grow">
            <button
              className={`inline-flex justify-center px-4 py-3 ${
                activeTab === "Dashboard"
                  ? "text-white bg-custom-850"
                  : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
              } w-full`}
              onClick={() => handleTabClick("Dashboard")}
            >
              Titulinis
            </button>
            <button
              className={`inline-flex justify-center px-4 py-3 ${
                activeTab === "InviteCode"
                  ? "text-white bg-custom-850"
                  : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
              } w-full`}
              onClick={() => handleTabClick("InviteCode")}
            >
              Pakvietimo kodai
            </button>
            <button
              className={`inline-flex justify-center px-4 py-3 ${
                activeTab === "Users"
                  ? "text-white bg-custom-850"
                  : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
              } w-full`}
              onClick={() => handleTabClick("Users")}
            >
              Naudotojai
            </button>
            <button
              className={`inline-flex justify-center px-4 py-3 ${
                activeTab === "Reports"
                  ? "text-white bg-custom-850"
                  : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
              } w-full`}
              onClick={() => handleTabClick("Reports")}
            >
              Reports
            </button>
            <button
              className={`inline-flex justify-center px-4 py-3 ${
                activeTab === "adminStats"
                  ? "text-white bg-custom-850"
                  : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
              } w-full`}
              onClick={() => handleTabClick("adminStats")}
            >
              Admin statistika
            </button>
          </div>
        </div>

        {activeTab === "Dashboard" ? (
          <>
            <div className="flex flex-col w-full relative overflow-auto">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Titulinis
                      </h1>
                    </div>

                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <div className="flex items-center text-1xl text-bold font-bold pr-6">
                        <Link to="/dashboard" className="btn btn-primary">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: "0.5rem" }}>
                              Vardas pavardė
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
                <div className="flex flex-col ml-3 mt-3 mr-8">
                  <div className="p-6 bg-custom-200 text-medium w-full h-[450px] ml-3 mt-3 mr-3">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Dashboard
                    </h1>
                  </div>

                  <div className="p-6 bg-custom-200 text-medium w-full h-[400px] ml-3 mt-3 mr-3 mb-5">
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
            <div className="flex flex-col w-full relative overflow-auto">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Naudotojai
                      </h1>
                    </div>

                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <div className="flex items-center text-1xl text-bold font-bold pr-6">
                        <Link to="/dashboard" className="btn btn-primary">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: "0.5rem" }}>
                              Vardas pavardė
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
                {/* END OF HEADER FOR ADMIN PANEL */}
                <div className="flex flex-col ml-3 mt-3 mr-8">
                  {/* Deleting invite code */}
                  <div className="p-6 bg-custom-200 text-medium w-full h-[230px] ml-3 mr-3 mb-6 ">
                    <h1 className="text-3xl font-mono font-font-extralight pb-3">
                      Ieškoti vartotojo NOT IMPLEMENTED
                    </h1>
                    <Form method="post">
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <label
                              htmlFor="deletetionEmail"
                              className="text-sm text-black"
                            >
                              El. paštas
                            </label>
                            <div className="relative">
                              <input
                                id="deletetionEmail"
                                name="deletetionEmail"
                                type="text"
                                ref={deletetionEmailRef}
                                autoComplete="on"
                                aria-describedby="email-error"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                        onClick={togglePopup}
                      >
                        Ieškoti
                      </button>

                      {popupOpen ? (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                          <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <p id="secretCode">
                              {secretCodeList && secretCodeList.length > 0 ? (
                                <>
                                  Sugeneruotas kodas:{" "}
                                  <strong>
                                    {
                                      secretCodeList[secretCodeList.length - 1]
                                        .secretCode
                                    }
                                  </strong>
                                </>
                              ) : (
                                <p id="secretCode">test</p>
                              )}
                            </p>

                            <p className="text-red-500 mt-4">
                              Uždarius šią lentelę, Jūs nebegalėsite matyti kodo
                            </p>
                            <div className="mt-4">
                              <button
                                className="px-4 py-2 bg-custom-800 text-white rounded-md hover:bg-custom-850 transition duration-300 ease-in-out"
                                onClick={togglePopup}
                              >
                                Uždaryti
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </Form>
                  </div>

                  {/*  */}

                  {/* <div className="p-6 bg-custom-200 text-medium  w-full h-[400px] ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight">
                      Visi vartotojai
                    </h1>
                    <div className=""></div>
                  </div> */}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Reports" ? (
          <>
            <div className="flex flex-col w-full relative overflow-auto">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">Reportai</h1>
                    </div>

                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <div className="flex items-center text-1xl text-bold font-bold pr-6">
                        <Link to="/dashboard" className="btn btn-primary">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: "0.5rem" }}>
                              Vardas pavardė
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
                {/* END OF HEADER FOR ADMIN PANEL */}
                <div className="flex flex-col ml-3 mt-3 mr-8">
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
            <div className="flex flex-col w-full relative overflow-auto">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Admin statistika
                      </h1>
                    </div>

                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <div className="flex items-center text-1xl text-bold font-bold pr-6">
                        <Link to="/dashboard" className="btn btn-primary">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: "0.5rem" }}>
                              Vardas pavardė
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
                {/* END OF HEADER FOR ADMIN PANEL */}
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
            <div className="flex flex-col w-full relative overflow-auto">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Pakvietimo kodai
                      </h1>
                    </div>

                    <div className="flex items-center text-1xl text-bold font-bold pr-6">
                      <div className="flex items-center text-1xl text-bold font-bold pr-6">
                        <Link to="/dashboard" className="btn btn-primary">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span style={{ marginRight: "0.5rem" }}>
                              Vardas pavardė
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
                {/* END OF HEADER FOR ADMIN PANEL */}

                <div className="flex flex-col ml-3 mt-3 mr-8 ">
                  <div className="p-6 bg-custom-200 text-medium w-full h-[380px] ml-3 mt-3 mr-3 ">
                    <h1 className="text-3xl font-mono font-font-extralight pb-3">
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
                                <option value="holder"></option>
                                <option value="thirtyMinutes">
                                  30 minučių
                                </option>
                                <option value="oneHour">1 valandai</option>
                                <option value="fifeHours">5 valandom</option>
                                <option value="twelveHours">12 valandų</option>
                                <option value="twentyForHours">
                                  24 valandom
                                </option>
                                <option value="oneWeek">1 savaitei</option>
                                <option value="oneMonth">1 mėnesiui</option>
                                <option value="threeMonths">3 mėnesiai</option>
                                <option value="sixMonths">6 mėnesiai</option>
                                <option value="nineMonths">9 mėnesiai</option>
                                <option value="oneYear">1 metai</option>
                                <option value="twoYears">2 metai</option>
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
                                <option value="holder"></option>
                                <option value="worker">Darbuotojas</option>
                                <option value="client">Klientas</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                        onClick={togglePopup}
                      >
                        Sukurti kodą
                      </button>

                      {popupOpen ? (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                          <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <p id="secretCode">
                              {secretCodeList && secretCodeList.length > 0 ? (
                                <>
                                  Sugeneruotas kodas:{" "}
                                  <strong>
                                    {
                                      secretCodeList[secretCodeList.length - 1]
                                        .secretCode
                                    }
                                  </strong>
                                </>
                              ) : (
                                <p id="secretCode">test</p>
                              )}
                            </p>

                            <p className="text-red-500 mt-4">
                              Uždarius šią lentelę, Jūs nebegalėsite matyti kodo
                            </p>
                            <div className="mt-4">
                              <button
                                className="px-4 py-2 bg-custom-800 text-white rounded-md hover:bg-custom-850 transition duration-300 ease-in-out"
                                onClick={togglePopup}
                              >
                                Uždaryti
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </Form>
                  </div>

                  <div className="p-6 bg-custom-200 text-medium w-full ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight pb-2">
                      Sistemoje esantys pakvietimo kodai
                    </h1>
                    <div className="">
                      <div className="mt-4 mb-8">
                        <input
                          type="text"
                          placeholder="Ieškokite pagal el. paštą"
                          value={searchTerm}
                          onChange={handleSearch}
                          className="px-4 py-2 border rounded-md w-full"
                        />
                      </div>
                      <table className="min-w-full text-center text-sm font-light">
                        <thead className="border-b bg-neutral-50 font-medium ">
                          <tr>
                            <th className="px-6 py-4 w-16">#</th>
                            <th className="px-6 py-4 w-1/6">Pavadinimas</th>
                            <th className="px-6 py-4 w-1/6">El. paštas</th>
                            <th className="px-6 py-4 w-1/6">Rolė</th>
                            <th className="px-6 py-4 w-1/6">Kontrakto nr.</th>
                            <th className="px-6 py-4 w-1/6">Sukūrimo data</th>
                            <th className="px-6 py-4 w-1/6">Galiojimo data</th>
                            <th className="px-6 py-4 w-1/6">Panaudojimas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((code, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4">{code.customName}</td>
                              <td className="px-6 py-4">{code.email}</td>
                              <td className="px-6 py-4">{code.role}</td>
                              <td className="px-6 py-4">
                                {code.contractNumber}
                              </td>
                              <td className="px-6 py-4">
                                {new Date(code.CreationData).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                  }
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {new Date(code.ExpirationDate).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                  }
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {code.Used ? "Panaudotas" : "Nepanaudotas"}
                              </td>
                            </tr>
                          ))}
                          {currentItems.length < itemsPerPage
                            ? Array(itemsPerPage - currentItems.length)
                                .fill(null)
                                .map((_, index) => (
                                  <tr key={`empty-${index}`}>
                                    <td className="px-6 py-4">&nbsp;</td>
                                    <td className="px-6 py-4">&nbsp;</td>
                                    <td className="px-6 py-4">&nbsp;</td>
                                    <td className="px-6 py-4">&nbsp;</td>
                                    <td className="px-6 py-4">&nbsp;</td>
                                    <td className="px-6 py-4">&nbsp;</td>
                                    <td className="px-6 py-4">&nbsp;</td>
                                  </tr>
                                ))
                            : null}
                        </tbody>
                      </table>
                      <div className="mt-4">
                        <ul className="flex justify-center">
                          {totalPages > 1
                            ? Array.from({ length: totalPages }).map(
                                (_, index) => (
                                  <li key={index} className="mx-1">
                                    <button
                                      className={`px-3 py-1 rounded ${
                                        currentPage === index + 1
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-gray-700"
                                      }`}
                                      onClick={() => paginate(index + 1)}
                                    >
                                      {index + 1}
                                    </button>
                                  </li>
                                )
                              )
                            : null}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Deleting invite code */}
                  <div className="p-6 bg-custom-200 text-medium w-full h-[230px] ml-3 mr-3 mb-6 ">
                    <h1 className="text-3xl font-mono font-font-extralight pb-3">
                      Pakvietimo kodo ištrynimas NOT IMPLEMENTED
                    </h1>
                    <Form method="post">
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <label
                              htmlFor="deletetionEmail"
                              className="text-sm text-black"
                            >
                              El. paštas
                            </label>
                            <div className="relative">
                              <input
                                id="deletetionEmail"
                                name="deletetionEmail"
                                type="text"
                                ref={deletetionEmailRef}
                                autoComplete="on"
                                aria-describedby="email-error"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                        // onClick={togglePopup}
                      >
                        Ištrinti kodą
                      </button>
                    </Form>
                  </div>

                  {/*  */}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
