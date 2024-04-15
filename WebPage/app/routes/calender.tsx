import { LoaderFunctionArgs, json } from "@remix-run/node";

import { useEffect, useState } from "react";

import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import NavBar from "~/components/common/NavBar/NavBar";
import { getNoteListItems } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import Calendar from "react-calendar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
  };
  function CalendarComponent() {
  const [date, setDate] = useState(new Date());

  // Handle date change
  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto pb-3">
      <NavBarHeader title={"Darbų sąrašas"} />
      <div className="flex justify-center mt-3">
        <Calendar onChange={onChange} value={date} />
      </div>
    </div>
  );
}

export default CalendarComponent;