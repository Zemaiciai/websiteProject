import { LoaderFunctionArgs, json } from "@remix-run/node";
import React, { useState, useEffect } from "react";

import { getNoteListItems } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
};

const Questionnaire = () => {
  const [questions, setQuestions] = useState([
    {
      text: "Question 1",
      answer: "",
      choices: ["Option 1", "Option 2", "Option 3"],
      error: false // Error state for each question
    },
    {
      text: "Question 2",
      answer: "",
      choices: ["Choice A", "Choice B", "Choice C", "Choice D"],
      error: false
    },
    {
      text: "Question 3",
      answer: "",
      choices: ["Red", "Green", "Blue"],
      error: false
    },
    {
      text: "Question 4",
      answer: "",
      choices: ["Yes", "No"],
      error: false
    },
    {
      text: "Question 4",
      answer: "",
      choices: ["Yes", "No"],
      error: false
    },
    {
      text: "Question 4",
      answer: "",
      choices: ["Yes", "No"],
      error: false
    },
    {
      text: "Question 4",
      answer: "",
      choices: ["Yes", "No"],
      error: false
    },
    {
      text: "Question 4",
      answer: "",
      choices: ["Yes", "No"],
      error: false
    },
    {
      text: "Question 4",
      answer: "",
      choices: ["Yes", "No"],
      error: false
    },
    {
      text: "Question 5",
      answer: "",
      choices: ["Option 1", "Option 2", "Option 3", "Option 4"],
      error: false
    }
    // Add more questions as needed
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [submitted, setSubmitted] = useState(false); // State for tracking form submission
  const [error, setError] = useState(false); // State for tracking global error

  // Reset error state when the user changes pages or answers
  useEffect(() => {
    setError(false);
  }, [currentPage, questions]);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const { value } = e.target;
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].answer = value;
      updatedQuestions[index].error = false; // Clear error for the answered question
      return updatedQuestions;
    });
  };

  const handleNextPage = () => {
    // Check if all questions on the current page are answered
    const startIndex = (currentPage - 1) * 4;
    const endIndex = Math.min(startIndex + 4, questions.length);
    let hasError = false; // Variable to track if there's any error on the current page
    const updatedQuestions = questions.map((question, i) => {
      if (i >= startIndex && i < endIndex && question.answer === "") {
        return { ...question, error: true }; // Set error state for unanswered questions on the current page
      }
      return question;
    });
    setQuestions(updatedQuestions); // Update questions with error state
    hasError = updatedQuestions.some((question) => question.error); // Check if there's any error on the current page
    if (hasError) {
      setError(true); // Set global error state if there's any error on the page
      return; // Exit function early if there's an error
    }
    setError(false); // Clear global error state if all questions are answered
    setCurrentPage((prevPage) => prevPage + 1); // Proceed to the next page
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = () => {
    // Check if all questions are answered before submitting
    let hasError = false; // Variable to track if there's any error on any page
    const updatedQuestions = questions.map((question) => {
      if (question.answer === "") {
        hasError = true; // Set flag indicating there's an error
        return { ...question, error: true }; // Set error state for unanswered questions
      }
      return question;
    });
    setQuestions(updatedQuestions); // Update questions with error state
    if (hasError) {
      setError(true); // Set global error state if there's any error on any page
      return; // Exit function early if there's an error
    }
    setError(false); // Clear global error state if all questions are answered
    setSubmitted(true); // Mark form as submitted
    // Handle form submission (e.g., send data to backend)
    console.log("Form submitted with answers:", questions);
  };

  const renderQuestions = () => {
    const startIndex = (currentPage - 1) * 4;
    const endIndex = Math.min(startIndex + 4, questions.length);

    return questions.slice(startIndex, endIndex).map((question, index) => (
      <div className="mb-4" key={index + startIndex}>
        <label
          htmlFor={(index + startIndex).toString()}
          className="block mb-2 font-bold"
        >
          {question.text}
        </label>
        <select
          id={(index + startIndex).toString()} // Convert to string
          value={question.answer}
          onChange={(e) => handleSelectChange(e, index + startIndex)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="">Select an option</option>
          {question.choices.map((choice, i) => (
            <option key={i} value={choice}>
              {choice}
            </option>
          ))}
        </select>
        {question.error ? (
          <p className="text-red-500 mt-1">Please select an option</p>
        ) : null}
      </div>
    ));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex flex-col items-center">
            {renderQuestions()}
            <div
              className={`flex ${currentPage !== 1 ? "justify-between" : "justify-center"} w-full`}
            >
              {currentPage !== 1 ? (
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  className="mt-4 mr-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-opacity duration-300"
                >
                  Previous
                </button>
              ) : null}
              {currentPage !== Math.ceil(questions.length / 4) ? (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-opacity duration-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              )}
            </div>
            {error ? (
              <p className="text-red-500 mt-2 ml-4">
                Please answer all questions before proceeding.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;
