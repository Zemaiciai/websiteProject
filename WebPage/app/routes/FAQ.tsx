import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "express";
import { useState } from "react";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import NewFooter from "~/components/newFooter/NewFooter";

import { getNoteListItems } from "~/models/note.server";
import { requireUser, requireUserId } from "~/session.server";

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
    <div className="flex h-screen bg-custom-100">
      {/* Navigation Sidebar */}
      <div className="navbar-container">
        <NavBar
          title={"Groups"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={activeTab}
          tabTitles={["Orders", "Admin", "Messages", "Profile"]}
        />
      </div>

      <div className="w-screen h-screen flex flex-grow flex-col bg-custom-100 pb-3">
        <NavBarHeader title={`${activeTab ? "D.U.K." : "Grupės"}`} />
        <div className="flex justify-between">
          <div style={{ marginLeft: "20%", padding: "20px" }}>
            <h1>Frequently Asked Questions</h1>
            <ul>
              {questions.map((item, index) => (
                <li
                  key={index}
                  id={`question${index + 1}`}
                  style={{ marginBottom: "20px" }}
                >
                  <button
                    onClick={() => toggleAnswer(index)}
                    style={{
                      position: "relative",
                      padding: "15px", // Increased padding to make the button bigger
                      margin: "5px 0",
                      borderRadius: "5px",
                      backgroundColor: "#f0f0f0",
                      textDecoration: "none",
                      color: "#333",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "400%", // Adjusted to fit the content
                    }}
                  >
                    <strong>{item.question}</strong>
                    <span
                      style={{
                        borderStyle: "solid",
                        borderWidth: "5px 5px 0",
                        borderColor:
                          "black transparent transparent transparent",
                        display: "inline-block",
                        width: 0,
                        height: 0,
                        transform: `rotate(${item.isOpen ? "180deg" : "0deg"})`, // Rotate based on item.isOpen
                        transition: "transform 0.3s ease", // Smooth transition
                      }}
                    ></span>
                  </button>
                  {item.isOpen ? <p>{item.answer}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <NewFooter />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
