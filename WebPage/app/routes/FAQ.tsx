import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useState } from "react";

import { getNoteListItems } from "~/models/note.server";
import { requireUser, requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await requireUser(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
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

    // Scroll to the question
    const questionElement = document.getElementById(`question${index + 1}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <h1>Your Website Header</h1>
      </header>

      {/* Navigation Sidebar */}
      <div
        style={{
          float: "left",
          width: "10%",
          padding: "20px",
          backgroundColor: "#616161",
          borderRadius: "10px",
          position: "sticky",
          top: "0",
        }}
      >
        <nav>
          <p
            style={{
              color: "white",
              textAlign: "left",
              marginLeft: "20px",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            Navigation
          </p>
          {/* Your navigation links to question anchors go here */}
          <ul>
            {questions.map((item, index) => (
              <li key={index}>
                <a
                  href={`#question${index + 1}`}
                  onClick={() => toggleAnswer(index)}
                  style={{ color: "white" }}
                >
                  {item.question}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
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
                  width: "50%", // Adjusted to fit the content
                }}
              >
                <strong>{item.question}</strong>
                <span
                  style={{
                    borderStyle: "solid",
                    borderWidth: "5px 5px 0",
                    borderColor: "black transparent transparent transparent",
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

      <footer
        style={{
          textAlign: "center",
          borderTop: "1px solid black",
          clear: "both",
          width: "100%",
          backgroundColor: "black",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "black",
          }}
        >
          {/* Footer Section 1 */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "#000000",
              textAlign: "left",
            }}
          >
            <a
              style={{
                color: "red",
                textAlign: "left",
                marginLeft: "20px",
                fontWeight: "bold",
              }}
              href="https://www.vectorstock.com/royalty-free-vector/jco-letter-logo-design-on-black-background-vector-41865826"
            >
              Logotipas
            </a>
            <p
              style={{
                color: "white",
                marginLeft: "20px",
                marginTop: "10px",
                maxWidth: "calc(100% - 20px)",
                wordWrap: "break-word",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              facilisis ligula et massa sollicitudin tristique. Vestibulum non
              magna
            </p>
            <p
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              We Accept
            </p>
          </div>

          {/* Footer Section 2 */}
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#000000" }}>
            <p
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: "20px",
                fontWeight: "bold",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
          </div>

          {/* Footer Section 3 */}
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#000000" }}>
            <p
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: "20px",
                fontWeight: "bold",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
            <p
              style={{
                color: "gray",
                textAlign: "left",
                marginLeft: "20px",
                marginTop: "10px",
              }}
            >
              Text
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
