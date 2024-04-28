import { FaqPage } from "@prisma/client";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import NewFooter from "~/components/newFooter/NewFooter";
import { getFAQQuestions } from "~/models/faqPage.server";
import { requireUser, requireUserId } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "D.U.K. - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await requireUser(request);
  const faqMessages = await getFAQQuestions();
  return faqMessages;
};

const FAQ = () => {
  const faqMessages = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("myGroups");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQMessages, setFilteredFAQMessages] = useState<FaqPage[]>([]);
  const [searchNotFound, setSearchNotFound] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredFAQMessages(faqMessages);
      setSearchNotFound(false);
    } else {
      const filtered = faqMessages.filter((message) =>
        message.questionName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredFAQMessages(filtered);
      setSearchNotFound(filtered.length === 0);
    }
  }, [searchQuery, faqMessages]);

  return (
    <div className="flex h-screen bg-custom-100">
      {/* Navigation Sidebar */}
      <div className="navbar-container">
        <NavBar
          title={"Žemaičiai"}
          handleTabClick={handleTabClick}
          redirectTo={"faq"}
          activeTab={activeTab}
          tabTitles={["Orders", "Admin", "Messages", "Profile"]}
        />
      </div>

      <div className="w-screen h-screen flex flex-col bg-custom-100 pb-3">
        <NavBarHeader title={`${activeTab ? "D.U.K." : "Grupės"}`} />
        <div className="flex justify-between bg-custom-200 m-3">
          <div className="mb-1">
            <div className="w-full px-5">
              {" "}
              {/* Adjusted width and added padding */}
              <h1 className="font-bold text-2xl pt-4">
                Jei norite lengviau atrasti atsakymą į jūsų klausimą ieškoti
                galite čia
              </h1>
            </div>

            <div className="m-4 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ieškoti klausimo..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex bg-custom-200 ml-3 mr-3 mb-3">
          <div className="w-full mx-auto mt-5 mb-5 ml-5 mr-5 divide-y shadow shadow-custom-800 rounded-xl">
            {searchNotFound ? (
              <div className="m-3 font-bold text-black">
                Dėja, bet nieko neradome.
              </div>
            ) : (
              filteredFAQMessages.map((item, index) => (
                <li key={index} className="m-3 list-none">
                  <details className="group ">
                    <summary className="flex items-center gap-3 px-4 py-1 font-medium marker:content-none hover:cursor-pointer mt-5 pb-3">
                      <svg
                        className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        ></path>
                      </svg>
                      <span className="">{item.questionName}</span>
                    </summary>
                    <article className="px-4 pb-4">
                      <p>{item.questionAnswer}</p>
                    </article>
                  </details>
                </li>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
