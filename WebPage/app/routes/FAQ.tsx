import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import NewFooter from "~/components/newFooter/NewFooter";

import { requireUser, requireUserId } from "~/session.server";
export const meta: MetaFunction = () => [{ title: "D.U.K. - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await requireUser(request);
  return null;
};

const FAQ = () => {
  const [questions, setQuestions] = useState([
    {
      question: "Question1",
      answer: "Answer1",
      isOpen: false,
    },
    {
      question: "Question2",
      answer: "Answer2",
      isOpen: false,
    },
    {
      question: "Question3",
      answer: "Answer3",
      isOpen: false,
    },
    {
      question: "Question4",
      answer: "Answer4",
      isOpen: false,
    },
    {
      question: "Question5",
      answer: "Answer5",
      isOpen: false,
    },
    {
      question: "Question6",
      answer: "Answer6",
      isOpen: false,
    },
    {
      question: "Question7",
      answer: "Answer7",
      isOpen: false,
    },
    {
      question: "Question8",
      answer: "Answer8",
      isOpen: false,
    },
  ]);

  const toggleAnswer = (index: number): void => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === index ? { ...q, isOpen: !q.isOpen } : q,
      ),
    );
  };

  const [activeTab, setActiveTab] = useState("myGroups");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-full bg-custom-100">
      <div className="w-full h-full flex flex-grow flex-col bg-custom-100">
        <div className="flex justify-between bg-custom-200 m-3">
          <div
            className="max-w-full mx-auto mt-5 mb-5 divide-y   shadow shadow-custom-800 rounded-xl"
            style={{ width: "80%" }}
          >
            {questions.map((item, index) => (
              <li key={index} className="mb-2 list-none">
                <details className="group">
                  <summary className="flex items-center gap-3 px-4 py-1 font-medium marker:content-none hover:cursor-pointer">
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
                    <span>{item.question}</span>
                  </summary>
                  <article className="px-4 pb-4">
                    <p>{item.answer}</p>
                  </article>
                </details>
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
