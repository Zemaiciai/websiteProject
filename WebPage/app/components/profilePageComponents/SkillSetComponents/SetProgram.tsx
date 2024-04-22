import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";

import { requireUser } from "~/session.server";

interface ProgramInfo {
  programName: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const progName = String(formData.get("programName"));
  const selectedExperience = String(formData.get("selectedExperience"));
};

export default function SetProgram({ programName }: ProgramInfo) {
  const [vueExperience, setVueExperience] = useState(0); // State to hold the experience for Vue JS
  const [isVueChecked, setIsVueChecked] = useState(false); // State to manage the visibility of Vue JS dropdown

  const handleVueCheckboxChange = (event) => {
    setIsVueChecked(event.target.checked);
  };

  const handleVueExperienceChange = (event) => {
    setVueExperience(parseInt(event.target.value));
  };
  return (
    <Form method="post">
      <li className="w-full border-b border-gray-200 rounded-t-lg h-[50px]">
        <div className="flex items-center ps-3 h-[50px]">
          <input
            id="programName"
            type="checkbox"
            value=""
            checked={isVueChecked}
            onChange={handleVueCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-2"
          />
          <label
            htmlFor="vue-checkbox"
            className="text-sm font-medium text-gray-900"
          >
            {programName}
          </label>
          {isVueChecked && ( // Render dropdown only if Vue checkbox is checked
            <div className="ml-auto">
              <label htmlFor="vue-experience" className="sr-only">
                Experience:
              </label>
              <select
                id="selectedExperience"
                value={vueExperience}
                onChange={handleVueExperienceChange}
                className="w-20 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="0">Select</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                {/* Add more options as needed */}
              </select>
            </div>
          )}
        </div>
      </li>
    </Form>
  );
}
