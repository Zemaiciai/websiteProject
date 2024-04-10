import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { getAllLogs } from "~/models/adminLogs.server";

import { createCode, getAllcodes } from "~/models/secretCode.server";
import {
  User,
  baningUser,
  changeUserInformation,
  getAllusers,
  getUserByEmail,
  unBaningUser,
  warningUser,
} from "~/models/user.server";
import { requireUser } from "~/session.server";

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

interface AdminLogs {
  id: string;
  user: string;
  information: string;
  createdAt: string; // Change the type to Date
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const secretCodeList = await getAllcodes();
  const userList = await getAllusers();
  const user = await requireUser(request);
  const logsOfAdmin = await getAllLogs();
  return json({ secretCodeList, userList, user, logsOfAdmin });
};

export const action = async (actionArg) => {
  const formData = await actionArg.request.formData();
  const formId = formData.get("form-id");
  const adminUserName = formData.get("adminUserName");
  if (formId === "codeGeneration") {
    const email = String(formData.get("emailAdress"));
    const customName = String(formData.get("customName"));
    const contractNumber = String(formData.get("contractNumber"));
    const roleSelection = String(formData.get("roleSelection"));
    const code = String(formData.get("selectedTime"));
    const selectedPercentage = String(formData.get("selectedPercentage"));
    const createdCode = await createCode(
      customName,
      email,
      contractNumber,
      roleSelection,
      code,
      selectedPercentage,
      adminUserName,
    );
    const secretCode = createdCode ? createdCode.secretCode : null;
    const secretCodeList = await getAllcodes();
    return json(secretCode);
  } else if (formId === "findingUser") {
    const email = String(formData.get("findingUserEmail"));
    const user = await getUserByEmail(email);
    return json(user);
  } else if (formId === "baningUser") {
    const emailID = formData.get("email-id");
    const banReason = String(formData.get("baningUserReason"));
    return baningUser(emailID, banReason, adminUserName);
  } else if (formId === "unbaningUser") {
    const emailID = formData.get("email-id");
    return unBaningUser(emailID, adminUserName);
  } else if (formId === "warningUser") {
    const emailID = formData.get("email-id");
    const warningReason = String(formData.get("warningReason"));
    return warningUser(emailID, warningReason, adminUserName);
  } else if (formId === "changingUserInformationAdmin") {
    const emailID = formData.get("email-id");
    const firstNameChange = formData.get("changeFirstName");
    const lastNameChange = formData.get("changeLastName");
    const nickNameChange = formData.get("changeUserName");
    const emailChange = formData.get("changeEmail");
    const roleChange = formData.get("changeRole");
    const timeChange = formData.get("changeTime");
    const percentage = formData.get("changePercentage");
    return changeUserInformation(
      emailID,
      firstNameChange,
      lastNameChange,
      nickNameChange,
      emailChange,
      roleChange,
      timeChange,
      percentage,
      adminUserName,
    );
  } else {
    return null;
  }
};

export default function NotesPage() {
  // Admin page tabs
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [popupOpen, setPopupOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    console.log(tab);
  };
  // Admin page user page tabs
  const [activeTabUsers, setActiveTabUsers] = useState("userInformation");
  const handleTabClickUser = (tab: string) => {
    setActiveTabUsers(tab);
    console.log(tab);
  };

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  const data = useLoaderData<typeof loader>();

  const emailRef = useRef<HTMLInputElement>(null);
  const customNameRef = useRef<HTMLInputElement>(null);
  const contractNumberRef = useRef<HTMLInputElement>(null);
  const deletetionEmailRef = useRef<HTMLInputElement>(null);
  const findingUserEmailRef = useRef<HTMLInputElement>(null);
  const baningUserReasonRef = useRef<HTMLInputElement>(null);

  const secretCodeList = data.secretCodeList;
  const adminLogItems: AdminLogs[] = data.logsOfAdmin;

  const userShitNahui = useActionData<User>();
  const userList = useLoaderData<{ userList: User[] }>().userList;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const itemsPerPageForLogs = 30;
  const indexOfLastItemForLogs = currentPage * itemsPerPageForLogs;
  const indexOfFirstItemForLogs = indexOfLastItemForLogs - itemsPerPageForLogs;

  const currentAdminLogItems = adminLogItems
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA;
      }
      // Handle cases where createdAt is not a valid date
      return 0;
    })
    .slice(indexOfFirstItemForLogs, indexOfLastItemForLogs);

  const currentItems = secretCodeList
    .filter((code) =>
      code.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // Assuming createdAt exists in your secretCodeList items
      const dateA = new Date(a.CreationData).getTime();
      const dateB = new Date(b.CreationData).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA;
      }
      // Handle cases where createdAt is not a valid date
      return 0;
    })
    .slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = (event) => {
    setCurrentPage(1);
    setSearchTerm(event.target.value);
  };

  const paginateForInviteCode = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const paginateForAdminLogs = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(
    secretCodeList.filter((code) =>
      code.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ).length / itemsPerPage,
  );

  const totalPagesForLogs = Math.ceil(
    adminLogItems.filter((item) =>
      item.user.toLowerCase().includes(searchTerm.toLowerCase()),
    ).length / itemsPerPageForLogs,
  );

  const [roleSelection, setRoleSelection] = useState("holder");

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
            <button
              className={`inline-flex justify-center px-4 py-3 ${
                activeTab === "adminLogs"
                  ? "text-white bg-custom-850"
                  : "text-white bg-custom-900 hover:bg-custom-850 transition duration-300 ease-in-out"
              } w-full`}
              onClick={() => handleTabClick("adminLogs")}
            >
              Veiksmų istorija
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
            <div className="flex flex-col w-full relative overflow-auto bg-custom-100">
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
                  <div className="p-6 bg-custom-200 text-medium w-full h-[230px] ml-3 mr-3 mb-6 ">
                    <h1 className="text-3xl font-mono font-font-extralight pb-3">
                      Ieškoti vartotojo
                    </h1>
                    <Form method="post">
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <label
                              htmlFor="findingUserEmail"
                              className="text-sm text-black"
                            >
                              El. paštas
                            </label>
                            <div className="relative">
                              <input
                                name="form-id"
                                hidden
                                defaultValue="findingUser"
                              />
                              <input
                                id="findingUserEmail"
                                name="findingUserEmail"
                                type="text"
                                ref={findingUserEmailRef}
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
                          <div className="bg-custom-100 p-3 rounded-lg shadow-md text-center">
                            {userList ? (
                              <>
                                {/* Header for this popup to hold images */}
                                <div className="bg-custom-200 h-50 w-full flex justify-center items-center p-5">
                                  {/* Profile picture */}
                                  <div className="border border-custom-800">
                                    <h1 className="border-b border-custom-800 ">
                                      Avataro paveikslėlis
                                    </h1>
                                    <div className="">
                                      <img
                                        className=""
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAP1BMVEW6urr///+4uLj5+fnGxsa8vLz8/Pz39/e/v7/CwsLz8/O1tbXQ0NDV1dX09PTl5eXt7e3a2trLy8vg4ODS0tJ+jrBMAAAGl0lEQVR4nO2diXajOgxAjbHAbMEs//+tTzahTUIyZbGxyNOdnjNNmybcepMXVCEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhjkf+MejrwHg8b+vw3mBRXyp5NfXUllVlZSuDKX7PPYF+QFsdUQhAWoc2jJPE0ual+0wKhCobJ9w5fLE8hISdD2UaZY8k6XlUGv3/esa2iuX0LdTyT0rTo/StgcpLtsqsRYK3Rm0QR695gfuy6bT+LyLKkroyrtSlixq6c/Xyg6u1+3Y3kNCc0vWkTfoeLEeR4JQZllw78HnGSUuVpAguzTJ1gnaFpmknbxWERbta+f5VzEmbXGhQpSqvBfgymqa2Y9SXUVRyn5D6T3Syys4Ymsa852G+XiJwV/W6U5BjHHqCxRiVdu2t6WXmXE/V1exBf5CqtsuvVnyRru7wUBG722DM7mWlNsiiDZ5E4OuL0I7LlIWFLJL9rXBX8ck6SjXU5XOl7lfMElVbI2PgDAHqujsmCWGbD2tmoN6s2RDcciwcx9devCzhqV28y9qQHW0m5kFsbOpyPnhBVWwP1pbWEJFLkKFqQh9gYVITFBgIOKnFU6UGB7FVlqwd1L4nj62zgKoWq+GLb2+RvvrZyypji30Asjax2D/S1ZTGxCl30pKsJqC8WxYEhMUhd9KitWU2GRf1l6C7gfBhNiiFE59F3ughwTTpIvt9Iz3jga7GlplKHx3NAnOg0kBa7cK13Oj1ZkeXkRcktOKar7fsPAblVrSIrbUEyqAIa1FRe+GGbUyLAK0Q1qG39/TeF2kmSA2HsoAMQ2tqC1EXEpraV823g2JbbLh/NA3xOaHOMf3PAPOaA0WATpTcus0YvBsOMQWWuC7IdaxhV4A6XFvzZICtRXhr9+3AN/VtKa2Q2rvC/G8f0hsi1SCFD7Dmsa9Ii3wl575OKjgXiOjeXD/8JGvH0FqMekP+uanEAnGMzOjp1o6xhb5hBTGQ/ydZcTW8x8AUF7KUJGtpEJ4OTXU0ZrcP4FDmI3djp0vbSke2pvBWBID8GOnoFN8DbKFaE9q2bP6R7Bn9UkfZcfLqw+VYS0JHmh7Buw9M9l2S3dzV0runNAbJFTN3slw2lTk4u03oGK/p6Liz/SXEBR2vq/MjlpqFLV5/Sewu5d6+z6G0ZLmnOkteKHNtv22vKG2bPFvsC1uvpf7Km1wAmxjnO7H/0vSfv/WgG2C1ypDu5Ik9aqcA7dG358f+7I3AO6S8V/R/eV46wr3TCC3BLySSvTtr+RT5g+r1/aCbJi9FlmJoh5uy+aY3Ya6EF+Qa8glGZKg+qE1ZW4ztmR5adqhVyCnFEMXBzVcohO7wAsA2mLTfeFjl85EXrT1PfCUvAzmj8V3GIZhfCCfiX05x4BpkmgXpmxaPQG6UKrv63FsLONY971ShQbrPU17QVwm9J4HcbdmplXd2JG+zNPfpG3JlKotzUs78jd1oafniyk8iHnxq7AFY0fzwgYx+aoJYm6Gri+EG/yB1qnSd6CcLprBpMlPoqiPG1LTM+4JBs3QYGmSb6DYqtRQvqwmZh8UF19Py0EByVh8mt/ZT8b26P5a1o73aI7OutT9gqRQ7yZJOxxvg5o7LBqONrEs1s7G50Fo02BtBTILG9h1FjbL5d4UWM/cX6XsCiozK5umdF5x8nOK9v4qtyZ+YlPXG0jYuPi7Hpv1M3KPYxtKb3zf5PxLZvq4eYaxgurO01mvt4L40emoVbWq/d9J8oqJmYZPNgdze/3FlPuriTJmuBXq7buE+zQNRDiLKaHammd2v2HSFudvnqKg/9vVPlOer1jdz82EL8TpHXJ1cn8jXQm+y0TuX3B6j/LURMpQBbhn9C9yfVqYCihojiTx3I57L6NPa4uyGpJzutFHxyQZzpv+NxtydfsTtPconIN0t6afW4TT++Vn9DY20j8nlHknaU44z4DTidF/hoi1pGP4iQb+CstIRegym55wRFr6STS7VzH0PAND/CkxWwxJ957Bpxkgxwhuj4yBq6kMkPJqGyb07pT33HpbCX6ffhexn3GCgTPVQYAcJlsxYRuiPnNG8Z5Mh2yIu/+CjE/6oIbd+j/iFIgs8C20bfxKGjZlpPdMs3swIXuaCMszS4ImAQuQPHA7QVPVBUgeuJ2g6Qb/D4axu1KbYpjLkA3ZMDpsyIZsGB82ZEM2jA8bsiEbxocN2ZAN48OGbMiG8WFDNmTD+LAhG7JhfNiQDdkwPmzIhmwYHzZkQzaMDxu+8B/ez2RfoHkyKgAAAABJRU5ErkJggg=="
                                        alt="Contact Person"
                                        width={230}
                                        height={230}
                                      />
                                    </div>
                                  </div>
                                  {/* Background picture */}
                                  <div className="border-t border-r border-b border-custom-800">
                                    <h1 className="border-b border-custom-800">
                                      Fono paveikslėlis
                                    </h1>
                                    <div className="w-[800px] h-[230px]">
                                      <img
                                        className="w-full h-full object-cover"
                                        src="https://static.vecteezy.com/system/resources/thumbnails/026/747/041/small/dark-and-blue-concreate-and-cement-wall-to-present-product-and-background-generative-ai-free-photo.jpg"
                                        alt="Contact Person"
                                      />
                                    </div>
                                  </div>
                                </div>
                                {/* Main contents */}
                                <div className="flex pt-5 bg-custom-200 mt-2 pb-5">
                                  {/* Left column for buttons */}
                                  <div className="flex flex-col justify-center items-center w-[230px] ml-5">
                                    <button
                                      className={`inline-flex justify-center px-4 py-3 ${
                                        activeTabUsers === "userInformation"
                                          ? "text-white text-xs py-5 bg-custom-900 border-t border-black "
                                          : "text-white text-xs py-5 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      } w-full`}
                                      onClick={() =>
                                        handleTabClickUser("userInformation")
                                      }
                                    >
                                      Vartotojo informacija
                                    </button>
                                    <button
                                      className={`inline-flex justify-center px-4 py-3 ${
                                        activeTabUsers ===
                                        "changeUserInformation"
                                          ? "text-white text-xs py-5 bg-custom-900 border-t border-black "
                                          : "text-white text-xs py-5 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      } w-full`}
                                      onClick={() =>
                                        handleTabClickUser(
                                          "changeUserInformation",
                                        )
                                      }
                                    >
                                      Keisti vartotojo informacija
                                    </button>
                                    <button
                                      className={`inline-flex justify-center px-4 py-3 ${
                                        activeTabUsers === "banningUser"
                                          ? "text-white text-xs py-5 bg-custom-900 border-t border-black "
                                          : "text-white text-xs py-5 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      } w-full`}
                                      onClick={() =>
                                        handleTabClickUser("banningUser")
                                      }
                                    >
                                      Užblokuoti vartotoją
                                    </button>
                                    <button
                                      className={`inline-flex justify-center px-4 py-3 ${
                                        activeTabUsers === "unbanningUser"
                                          ? "text-white text-xs py-5 bg-custom-900 border-t border-black "
                                          : "text-white text-xs py-5 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      } w-full`}
                                      onClick={() =>
                                        handleTabClickUser("unbanningUser")
                                      }
                                    >
                                      Atblokuoti vartotoją
                                    </button>
                                    <button
                                      className={`inline-flex justify-center px-4 py-3  ${
                                        activeTabUsers === "warningUser"
                                          ? "text-white text-xs py-5 bg-custom-900 border-t border-black"
                                          : "text-white text-xs py-5 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      } w-full`}
                                      onClick={() =>
                                        handleTabClickUser("warningUser")
                                      }
                                    >
                                      Įspėti vartotoją
                                    </button>
                                    <button
                                      className={`inline-flex justify-center px-4 py-3  ${
                                        activeTabUsers === "viewWarnings"
                                          ? "text-white text-xs py-5 bg-custom-900 border-t border-black"
                                          : "text-white text-xs py-5 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      } w-full`}
                                      onClick={() =>
                                        handleTabClickUser("viewWarnings")
                                      }
                                    >
                                      Peržiūrėti įspėjimus
                                    </button>
                                    <button
                                      className={`inline-flex justify-center px-4 py-3  ${
                                        activeTabUsers === "removePictures"
                                          ? "text-white text-xs py-5 bg-custom-900 border-t border-black"
                                          : "text-white text-xs py-5 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      } w-full`}
                                      onClick={() =>
                                        handleTabClickUser("removePictures")
                                      }
                                    >
                                      Panaikinti nuotraukas
                                    </button>
                                    <button
                                      className="w-full px-22 py-5 text-xs bg-custom-800 text-white hover:bg-custom-850 transition duration-300 ease-in-out border-t border-black"
                                      style={{ textAlign: "center" }}
                                      onClick={togglePopup}
                                    >
                                      Uždaryti
                                    </button>
                                  </div>

                                  {activeTabUsers === "userInformation" ? (
                                    <>
                                      {/* Center column for center content of information */}
                                      <div className="flex-grow flex items-center pl-8">
                                        <div className="flex flex-col">
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">Vardas:</h1>
                                            <h1>{userShitNahui?.firstName}</h1>
                                          </div>
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">Pavardė:</h1>
                                            <h1>{userShitNahui?.lastName}</h1>
                                          </div>
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">Rolė:</h1>
                                            <h1>{userShitNahui?.role}</h1>
                                          </div>

                                          {userShitNahui?.role ===
                                          "Darbuotojas" ? (
                                            userShitNahui?.percentage !== "" ? (
                                              <div className="flex mb-5">
                                                <h1 className="mr-2">
                                                  Atlygis nuo vartotojo:
                                                </h1>
                                                <h1>
                                                  {userShitNahui?.percentage}
                                                </h1>
                                              </div>
                                            ) : (
                                              <div className="flex mb-5">
                                                <h1 className="mr-2">
                                                  Atlygis nuo vartotojo:
                                                </h1>
                                                <h1 className="text-red-600">
                                                  NUSTATYKITE!!
                                                </h1>
                                              </div>
                                            )
                                          ) : null}

                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Slapyvardis:
                                            </h1>
                                            <h1>{userShitNahui?.userName}</h1>
                                          </div>
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              El. Paštas:
                                            </h1>
                                            <h1>{userShitNahui?.email}</h1>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Right column for right content of information */}
                                      <div className="flex-grow flex items-center pl-8">
                                        <div className="flex flex-col">
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Sukūrimo data:
                                            </h1>
                                            <h1>
                                              {userShitNahui?.createdAt
                                                ? new Date(
                                                    userShitNahui.createdAt,
                                                  )
                                                    .toLocaleDateString(
                                                      "en-CA",
                                                      {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                      },
                                                    )
                                                    .replace(/\//g, "-") +
                                                  ", " +
                                                  new Date(
                                                    userShitNahui.createdAt,
                                                  ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                  })
                                                : null}
                                            </h1>
                                          </div>

                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Atnaujinimo data:
                                            </h1>
                                            <h1>
                                              {userShitNahui?.createdAt
                                                ? new Date(
                                                    userShitNahui.updatedAt,
                                                  )
                                                    .toLocaleDateString(
                                                      "en-CA",
                                                      {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                      },
                                                    )
                                                    .replace(/\//g, "-") +
                                                  ", " +
                                                  new Date(
                                                    userShitNahui.createdAt,
                                                  ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                  })
                                                : null}
                                            </h1>
                                          </div>
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Galioja iki:
                                            </h1>
                                            {userShitNahui?.expiringAt
                                              ? new Date(
                                                  userShitNahui.expiringAt,
                                                )
                                                  .toLocaleDateString("en-CA", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                  })
                                                  .replace(/\//g, "-") +
                                                ", " +
                                                new Date(
                                                  userShitNahui.expiringAt,
                                                ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: false,
                                                })
                                              : null}
                                          </div>
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Įspėjimų skaičius:
                                            </h1>
                                            <h1>
                                              {userShitNahui?.warningAmount}/3
                                            </h1>
                                          </div>
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Paskyros būsėna:
                                            </h1>
                                            <h1>{userShitNahui?.userStatus}</h1>
                                          </div>
                                          {userShitNahui?.banReason ? (
                                            <div className="flex mb-5">
                                              <h1 className="mr-2">
                                                Priežastis:
                                              </h1>
                                              <h1>
                                                {userShitNahui?.banReason}
                                              </h1>
                                            </div>
                                          ) : (
                                            <p></p>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ) : null}

                                  {activeTabUsers === "banningUser" ? (
                                    <>
                                      {/* Center column for center content of information */}
                                      <div className="flex items-center pl-8 ">
                                        <div className="flex flex-col">
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Šiuo veiksmu bus užblokuotas
                                              vartotojas kurio el. paštas:
                                            </h1>
                                            <h1>{userShitNahui?.email}</h1>
                                          </div>
                                          <Form method="post">
                                            <div className="flex flex-wrap mb-4">
                                              <div className="w-full px-10">
                                                <div className="flex flex-col">
                                                  <div className="relative">
                                                    <input
                                                      name="form-id"
                                                      hidden
                                                      defaultValue="baningUser"
                                                    />
                                                    <input
                                                      name="adminUserName"
                                                      hidden
                                                      defaultValue={
                                                        data.user.userName
                                                      }
                                                    />
                                                    <input
                                                      name="email-id"
                                                      hidden
                                                      defaultValue={
                                                        userShitNahui?.email
                                                      }
                                                    />
                                                    <input
                                                      id="baningUserReason"
                                                      name="baningUserReason"
                                                      type="text"
                                                      ref={baningUserReasonRef}
                                                      autoComplete="on"
                                                      aria-describedby="email-error"
                                                      className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none" // Increased py-2 for vertical padding
                                                      placeholder="Užblokavimo priežastis"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <h1 className="text-red-500">
                                              Įsitikinkite, kad yra blokuojama
                                              tinkama paskyra!
                                            </h1>
                                            <button
                                              type="submit"
                                              className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                                            >
                                              Užblokuoti!
                                            </button>
                                          </Form>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}

                                  {activeTabUsers ===
                                  "changeUserInformation" ? (
                                    <>
                                      {/* Center column for center content of information */}
                                      <div className="flex items-center pl-8 ">
                                        <div className="flex flex-col">
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Šiuo veiksmu galite keisti
                                              vartotojo informaciją, kurio el.
                                              paštas:
                                            </h1>
                                            <h1>{userShitNahui?.email}</h1>
                                          </div>
                                          <Form method="post">
                                            <div className="flex flex-wrap mb-4">
                                              <div className="w-full lg:w-1/2 px-10 order-2 lg:order-1">
                                                <div className="flex flex-col">
                                                  <input
                                                    name="form-id"
                                                    hidden
                                                    defaultValue="changingUserInformationAdmin"
                                                  />
                                                  <input
                                                    name="adminUserName"
                                                    hidden
                                                    defaultValue={
                                                      data.user.userName
                                                    }
                                                  />
                                                  <input
                                                    name="email-id"
                                                    hidden
                                                    defaultValue={
                                                      userShitNahui?.email
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="changeFirstName"
                                                    className="text-sm text-black"
                                                  >
                                                    Vardas
                                                  </label>
                                                  <input
                                                    id="changeFirstName"
                                                    name="changeFirstName"
                                                    type="text"
                                                    ref={baningUserReasonRef}
                                                    autoComplete="on"
                                                    aria-describedby="email-error"
                                                    className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none mb-4"
                                                    defaultValue={
                                                      userShitNahui?.firstName
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="changeLastName"
                                                    className="text-sm text-black"
                                                  >
                                                    Pavardė
                                                  </label>
                                                  <input
                                                    id="changeLastName"
                                                    name="changeLastName"
                                                    type="text"
                                                    ref={baningUserReasonRef}
                                                    autoComplete="on"
                                                    aria-describedby="email-error"
                                                    className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none mb-4"
                                                    defaultValue={
                                                      userShitNahui?.lastName
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="changeUserName"
                                                    className="text-sm text-black"
                                                  >
                                                    Slapyvardis
                                                  </label>
                                                  <input
                                                    id="changeUserName"
                                                    name="changeUserName"
                                                    type="text"
                                                    ref={baningUserReasonRef}
                                                    autoComplete="on"
                                                    aria-describedby="email-error"
                                                    className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none"
                                                    defaultValue={
                                                      userShitNahui?.userName
                                                    }
                                                  />
                                                  {userShitNahui?.role ===
                                                  "Darbuotojas" ? (
                                                    <>
                                                      <label
                                                        htmlFor="changePercentage"
                                                        className="text-sm text-black"
                                                      >
                                                        Atlygis nuo vartotojo
                                                      </label>
                                                      <select
                                                        id="changePercentage"
                                                        name="changePercentage"
                                                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                                                        defaultValue={
                                                          userShitNahui?.percentage ||
                                                          "Nežinomas"
                                                        }
                                                      >
                                                        <option value="1%">
                                                          1%
                                                        </option>
                                                        <option value="5%">
                                                          5%
                                                        </option>
                                                        <option value="10%">
                                                          10%
                                                        </option>
                                                        <option value="12%">
                                                          12%
                                                        </option>
                                                        <option value="15%">
                                                          15%
                                                        </option>
                                                        <option value="20%">
                                                          20%
                                                        </option>
                                                        <option value="25%">
                                                          25%
                                                        </option>
                                                        <option value="30%">
                                                          30%
                                                        </option>
                                                      </select>
                                                    </>
                                                  ) : null}
                                                </div>
                                              </div>
                                              <div className="w-full lg:w-1/2 px-10 order-1 lg:order-2">
                                                <div className="flex flex-col">
                                                  <label
                                                    htmlFor="changeEmail"
                                                    className="text-sm text-black"
                                                  >
                                                    El. paštas
                                                  </label>
                                                  <input
                                                    id="changeEmail"
                                                    name="changeEmail"
                                                    type="text"
                                                    ref={baningUserReasonRef}
                                                    autoComplete="on"
                                                    aria-describedby="email-error"
                                                    className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none mb-4"
                                                    defaultValue={
                                                      userShitNahui?.email
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="changeRole"
                                                    className="text-sm text-black"
                                                  >
                                                    Rolė
                                                  </label>
                                                  <select
                                                    id="changeRole"
                                                    name="changeRole"
                                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                                                    defaultValue={
                                                      userShitNahui?.role ||
                                                      "Darbuotojas"
                                                    }
                                                  >
                                                    {userShitNahui?.role ? (
                                                      <>
                                                        <option value="Darbuotojas">
                                                          Darbuotojas
                                                        </option>
                                                        <option value="Klientas">
                                                          Klientas
                                                        </option>
                                                        <option value="Admin">
                                                          Admin
                                                        </option>
                                                        <option value="Super Admin">
                                                          Super Admin
                                                        </option>
                                                      </>
                                                    ) : (
                                                      <option value="Darbuotojas">
                                                        Darbuotojas
                                                      </option>
                                                    )}
                                                  </select>
                                                  <label
                                                    htmlFor="changeTime"
                                                    className="text-sm text-black pt-7"
                                                  >
                                                    Galiojimo data
                                                  </label>
                                                  <select
                                                    id="changeTime"
                                                    name="changeTime"
                                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                                                  >
                                                    <option value="holder">
                                                      Nekeičiamas
                                                    </option>
                                                    <option value="oneMonth">
                                                      1 mėnesiui
                                                    </option>
                                                    <option value="threeMonths">
                                                      3 mėnesiai
                                                    </option>
                                                    <option value="sixMonths">
                                                      6 mėnesiai
                                                    </option>
                                                    <option value="nineMonths">
                                                      9 mėnesiai
                                                    </option>
                                                    <option value="oneYear">
                                                      1 metai
                                                    </option>
                                                    <option value="twoYears">
                                                      2 metai
                                                    </option>
                                                  </select>
                                                </div>
                                              </div>
                                            </div>
                                            <h1 className="text-red-500">
                                              Keičiant galiojimo laiką, laikas
                                              yra pridedamas prie esamo
                                              nustatyto!
                                            </h1>
                                            <h1 className="text-red-500">
                                              Įsitikinkite, kad keičiate tinkamą
                                              informaciją!
                                            </h1>
                                            <button
                                              type="submit"
                                              className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                                            >
                                              Pakeisti informaciją!
                                            </button>
                                          </Form>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}

                                  {activeTabUsers === "unbanningUser" ? (
                                    <>
                                      {/* Center column for center content of information */}
                                      <div className="flex items-center pl-8 ">
                                        <div className="flex flex-col">
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Šiuo veiksmu bus atblokuotas
                                              vartotojas kurio el. paštas:
                                            </h1>
                                            <h1>{userShitNahui?.email}</h1>
                                          </div>
                                          <Form method="post">
                                            <div className="flex flex-wrap mb-4">
                                              <div className="w-full px-10">
                                                <div className="flex flex-col">
                                                  <div className="relative">
                                                    <input
                                                      name="form-id"
                                                      hidden
                                                      defaultValue="unbaningUser"
                                                    />
                                                    <input
                                                      name="adminUserName"
                                                      hidden
                                                      defaultValue={
                                                        data.user.userName
                                                      }
                                                    />
                                                    <input
                                                      name="email-id"
                                                      hidden
                                                      defaultValue={
                                                        userShitNahui?.email
                                                      }
                                                    />
                                                    <input
                                                      id="unbaningUserEmail"
                                                      name="unbaningUserEmail"
                                                      type="text"
                                                      ref={baningUserReasonRef}
                                                      autoComplete="on"
                                                      aria-describedby="email-error"
                                                      className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none" // Increased py-2 for vertical padding
                                                      placeholder="El. paštas"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <h1 className="text-red-500">
                                              Norint patvirtintį šį veiksmą
                                              įveskite vartotojo el. paštą!
                                            </h1>
                                            <button
                                              type="submit"
                                              className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                                            >
                                              Atblokuoti!
                                            </button>
                                          </Form>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}

                                  {activeTabUsers === "warningUser" ? (
                                    <>
                                      {/* Center column for center content of information */}
                                      <div className="flex items-center pl-8 ">
                                        <div className="flex flex-col">
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Šiuo veiksmu bus uždėtas įspėjimas
                                              vartotojas kurio el. paštas:
                                            </h1>
                                            <h1>{userShitNahui?.email}</h1>
                                          </div>
                                          <Form method="post">
                                            <div className="flex flex-wrap mb-4">
                                              <div className="w-full px-10">
                                                <div className="flex flex-col">
                                                  <div className="relative">
                                                    <input
                                                      name="form-id"
                                                      hidden
                                                      defaultValue="warningUser"
                                                    />
                                                    <input
                                                      name="adminUserName"
                                                      hidden
                                                      defaultValue={
                                                        data.user.userName
                                                      }
                                                    />
                                                    <input
                                                      name="email-id"
                                                      hidden
                                                      defaultValue={
                                                        userShitNahui?.email
                                                      }
                                                    />
                                                    <input
                                                      id="warningReason"
                                                      name="warningReason"
                                                      type="text"
                                                      ref={baningUserReasonRef}
                                                      autoComplete="on"
                                                      aria-describedby="email-error"
                                                      className="w-full rounded border border-gray-500 px-2 py-2 text-lg focus:outline-none" // Increased py-2 for vertical padding
                                                      placeholder="Įspėjimo priežastis"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <h1 className="text-red-500">
                                              Įsitikinkite ar parinktas
                                              vartotojas tinkamas!
                                            </h1>
                                            <button
                                              type="submit"
                                              className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                                            >
                                              Įspėti!
                                            </button>
                                          </Form>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}

                                  {activeTabUsers === "viewWarnings" ? (
                                    <>
                                      <div className="flex items-center pl-8 ">
                                        <div className="flex flex-col">
                                          <div className="flex mb-5">
                                            <h1 className="mr-2">
                                              Šiuo metu žiūrite įspėjimus
                                              naudotojui kurio el. paštas:
                                            </h1>
                                            <h1>{userShitNahui?.email}</h1>
                                          </div>
                                          <table className="min-w-full text-center text-sm font-light w-[750px]">
                                            <thead className="border-b bg-neutral-50 font-medium">
                                              <tr>
                                                <th className="px-6 py-4 w-1/6">
                                                  Skaičius
                                                </th>
                                                <th className="px-6 py-4 w-1/6">
                                                  Įspėjimo priežastis
                                                </th>
                                                <th className="px-6 py-4 w-1/6">
                                                  Įspėjimo data
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {userShitNahui?.firstWarning ? (
                                                <tr>
                                                  <td className="px-6 py-4">
                                                    1
                                                  </td>
                                                  <td className="px-6 py-4">
                                                    {userShitNahui.firstWarning}
                                                  </td>
                                                  <td className="px-6 py-4">
                                                    {userShitNahui.firstWarningDate
                                                      ? new Date(
                                                          userShitNahui.firstWarningDate,
                                                        )
                                                          .toLocaleDateString(
                                                            "en-CA",
                                                            {
                                                              year: "numeric",
                                                              month: "2-digit",
                                                              day: "2-digit",
                                                            },
                                                          )
                                                          .replace(/\//g, "-") +
                                                        ", " +
                                                        new Date(
                                                          userShitNahui.firstWarningDate,
                                                        ).toLocaleTimeString(
                                                          [],
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                          },
                                                        )
                                                      : null}
                                                  </td>
                                                </tr>
                                              ) : (
                                                <tr>
                                                  <td
                                                    colSpan={3}
                                                    className="px-6 py-4"
                                                  >
                                                    Šis vartotojas neturi jokių
                                                    įspėjimų.
                                                  </td>
                                                </tr>
                                              )}
                                              {userShitNahui?.secondWarning ? (
                                                <tr>
                                                  <td className="px-6 py-4">
                                                    2
                                                  </td>
                                                  <td className="px-6 py-4">
                                                    {
                                                      userShitNahui.secondWarning
                                                    }
                                                  </td>
                                                  <td className="px-6 py-4">
                                                    {userShitNahui.secondWarningDate
                                                      ? new Date(
                                                          userShitNahui.secondWarningDate,
                                                        )
                                                          .toLocaleDateString(
                                                            "en-CA",
                                                            {
                                                              year: "numeric",
                                                              month: "2-digit",
                                                              day: "2-digit",
                                                            },
                                                          )
                                                          .replace(/\//g, "-") +
                                                        ", " +
                                                        new Date(
                                                          userShitNahui.secondWarningDate,
                                                        ).toLocaleTimeString(
                                                          [],
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                          },
                                                        )
                                                      : null}
                                                  </td>
                                                </tr>
                                              ) : null}
                                              {userShitNahui?.thirdWarning ? (
                                                <tr>
                                                  <td className="px-6 py-4">
                                                    3
                                                  </td>
                                                  <td className="px-6 py-4">
                                                    {userShitNahui.thirdWarning}
                                                  </td>
                                                  <td className="px-6 py-4">
                                                    {userShitNahui.thirdWarningDate
                                                      ? new Date(
                                                          userShitNahui.thirdWarningDate,
                                                        )
                                                          .toLocaleDateString(
                                                            "en-CA",
                                                            {
                                                              year: "numeric",
                                                              month: "2-digit",
                                                              day: "2-digit",
                                                            },
                                                          )
                                                          .replace(/\//g, "-") +
                                                        ", " +
                                                        new Date(
                                                          userShitNahui.thirdWarningDate,
                                                        ).toLocaleTimeString(
                                                          [],
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                          },
                                                        )
                                                      : null}
                                                  </td>
                                                </tr>
                                              ) : null}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}

                                  {activeTabUsers === "removePictures" ? (
                                    <>
                                      {/* Center column for center content of information */}
                                      CANNOT BE IMPLEMENTED YET
                                    </>
                                  ) : null}
                                </div>
                              </>
                            ) : (
                              <>
                                <p id="secretCode">nieko nėra</p>
                              </>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </Form>
                  </div>
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

        {activeTab === "adminLogs" ? (
          <>
            <div className="flex flex-col w-full relative overflow-auto">
              <div className="flex flex-col w-full bg-custom-100">
                {/* HEADER FOR ADMIN PANEL */}
                <div className="flex w-full flex-col h-70 border-solid border-b-4 border-gray-150 justify-center">
                  <div className="flex items-center justify-between">
                    <div className="pt-6 pl-6 pb-6">
                      <h1 className="text-2xl text-bold font-bold">
                        Veiksmų istorija
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
                  <div className="p-6 bg-custom-200 text-medium w-full ml-3 mt-3 mr-3 mb-5">
                    <h1 className="text-3xl font-mono font-font-extralight pb-2">
                      Administratorių veiksmų istorija
                    </h1>
                    <div className="">
                      <table className="min-w-full text-center text-sm font-light">
                        <thead className="border-b bg-neutral-50 font-medium">
                          <tr>
                            <th className="px-6 py-4 w-16">#</th>
                            <th className="px-6 py-4 w-1/6">Vartotojas</th>
                            <th className="px-6 py-4 w-1/2">Informacija</th>
                            <th className="px-6 py-4 w-1/6">Sukūrimo data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentAdminLogItems.map((adminItem, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4">
                                {indexOfFirstItemForLogs + index + 1}
                              </td>
                              <td className="px-6 py-4">{adminItem.user}</td>
                              <td className="px-6 py-4">
                                {adminItem.information}
                              </td>
                              <td className="px-6 py-4">
                                {adminItem.createdAt
                                  ? new Date(adminItem.createdAt)
                                      .toLocaleDateString("en-CA", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      })
                                      .replace(/\//g, "-") +
                                    ", " +
                                    new Date(
                                      adminItem.createdAt,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                  : null}
                              </td>
                            </tr>
                          ))}
                          {/* Fill empty rows if necessary */}
                          {Array.from({
                            length: itemsPerPage - currentAdminLogItems.length,
                          }).map((_, index) => (
                            <tr key={`empty-${index}`}>
                              <td className="px-6 py-4">&nbsp;</td>
                              <td className="px-6 py-4">&nbsp;</td>
                              <td className="px-6 py-4">&nbsp;</td>
                              <td className="px-6 py-4">&nbsp;</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="mt-4">
                        <ul className="flex justify-center">
                          {totalPagesForLogs > 1
                            ? Array.from({ length: totalPagesForLogs }).map(
                                (_, index) => (
                                  <li key={index} className="mx-1">
                                    <button
                                      className={`px-3 py-1 rounded ${
                                        currentPage === index + 1
                                          ? "bg-custom-850 text-white"
                                          : "bg-custom-800 text-white"
                                      }`}
                                      onClick={() =>
                                        paginateForAdminLogs(index + 1)
                                      }
                                    >
                                      {index + 1}
                                    </button>
                                  </li>
                                ),
                              )
                            : null}
                        </ul>
                      </div>
                    </div>
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
                  <div className="p-6 bg-custom-200 text-medium w-full h-[300px] ml-3 mt-3 mr-3 ">
                    <h1 className="text-3xl font-mono font-font-extralight pb-3">
                      Pakvietimo kodo generavimas
                    </h1>
                    <Form method="post">
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <div className="relative">
                              <input
                                name="form-id"
                                hidden
                                defaultValue="codeGeneration"
                              />
                              <input
                                id="customName"
                                name="customName"
                                type="text"
                                ref={customNameRef}
                                autoComplete="on"
                                aria-describedby="email-error"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                                placeholder="Pavadinimas"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <div className="flex flex-col">
                            <div className="relative">
                              <input
                                id="emailAdress"
                                name="emailAdress"
                                type="text"
                                ref={emailRef}
                                autoComplete="on"
                                aria-describedby="email-error"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                                placeholder="El. pašto adresas"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <div className="relative">
                              <input
                                id="contractNumber"
                                name="contractNumber"
                                type="text"
                                ref={contractNumberRef}
                                autoComplete="on"
                                aria-describedby="email-error"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
                                placeholder="Kontrakto numeris"
                              />
                              <input
                                name="adminUserName"
                                hidden
                                defaultValue={data.user.userName}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <div className="flex flex-col">
                            <div className="relative">
                              <select
                                id="selectedTime"
                                name="selectedTime"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                              >
                                <option value="holder">
                                  Pasirinkti kodo galiojimą
                                </option>
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

                      <div className="flex flex-wrap -mx-3 mb-1">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <div className="flex flex-col">
                            <div className="relative">
                              <select
                                id="roleSelection"
                                name="roleSelection"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                                value={roleSelection}
                                onChange={(e) =>
                                  setRoleSelection(e.target.value)
                                }
                              >
                                <option value="holder">Pasirinkti rolę</option>
                                <option value="worker">Darbuotojas</option>
                                <option value="client">Klientas</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {roleSelection === "worker" ? (
                          <div className="w-full md:w-1/2 px-3">
                            <div className="flex flex-col">
                              <div className="relative">
                                <select
                                  id="selectedPercentage"
                                  name="selectedPercentage"
                                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none"
                                >
                                  <option value="holder">
                                    Pasirinkti atlygi kurį gauna svetainė
                                  </option>
                                  <option value="1%">1%</option>
                                  <option value="5%">5%</option>
                                  <option value="10%">10%</option>
                                  <option value="12%">12%</option>
                                  <option value="15%">15%</option>
                                  <option value="20%">20%</option>
                                  <option value="25%">25%</option>
                                  <option value="30%">30%</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                      >
                        Sukurti kodą
                      </button>
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
                            <th className="px-6 py-4 w-1/6">Kodas</th>
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
                              <td className="px-6 py-4">
                                {indexOfFirstItem + index + 1}
                              </td>
                              <td className="px-6 py-4">{code.customName}</td>
                              <td className="px-6 py-4">{code.email}</td>
                              <td className="px-6 py-4">{code.secretCode}</td>
                              <td className="px-6 py-4">{code.role}</td>
                              <td className="px-6 py-4">
                                {code.contractNumber}
                              </td>
                              <td className="px-6 py-4">
                                {code.CreationData
                                  ? new Date(code.CreationData)
                                      .toLocaleDateString("en-CA", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      })
                                      .replace(/\//g, "-") +
                                    ", " +
                                    new Date(
                                      code.CreationData,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                  : null}
                              </td>
                              <td className="px-6 py-4">
                                {code.ExpirationDate
                                  ? new Date(code.ExpirationDate)
                                      .toLocaleDateString("en-CA", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      })
                                      .replace(/\//g, "-") +
                                    ", " +
                                    new Date(
                                      code.ExpirationDate,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })
                                  : null}
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
                                          ? "bg-custom-850 text-white"
                                          : "bg-custom-800 text-white"
                                      }`}
                                      onClick={() =>
                                        paginateForInviteCode(index + 1)
                                      }
                                    >
                                      {index + 1}
                                    </button>
                                  </li>
                                ),
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
