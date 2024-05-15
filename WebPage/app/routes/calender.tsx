import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";

import { useEffect, useState } from "react";

import NavBarHeader from "~/components/common/NavBar/NavBarHeader";

import { requireUserId } from "~/session.server";
import { getOrdersByUserId } from "~/models/order.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId, true);

  return typedjson(userOrders);
};

export const meta: MetaFunction = () => [{ title: "Kalendorius - Žemaičiai" }];

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredOrders, setHoveredOrders] = useState<string[]>([]);
  const userOrders = useTypedLoaderData<typeof loader>();
  const acceptedOrders = userOrders?.filter(
    (order) => order.orderStatus === "ACCEPTED",
  );
  const completionDates = acceptedOrders?.map((order) =>
    new Date(order.completionDate).toLocaleDateString(),
  ); // Convert Date to string

  // Function to get the days in a month
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to handle date selection
  const handleDateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string,
  ) => {
    const value = parseInt(event.target.value, 10);
    if (type === "year") {
      setSelectedDate(new Date(value, selectedDate.getMonth()));
    } else if (type === "month") {
      setSelectedDate(new Date(selectedDate.getFullYear(), value));
    }
  };

  // Function to generate the year options for the dropdown
  const generateYearOptions = (): JSX.Element[] => {
    const currentYear = new Date().getFullYear();
    const years: JSX.Element[] = [];
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(
        <option key={year} value={year}>
          {year}
        </option>,
      );
    }
    return years;
  };

  // Function to generate the month options for the dropdown
  const generateMonthOptions = (): JSX.Element[] => {
    const monthNames = [
      "Sausis",
      "Vasaris",
      "Kovas",
      "Balandis",
      "Gegužė",
      "Birželis",
      "Liepa",
      "Rugpjūtis",
      "Rugsėjis",
      "Spalis",
      "Lapkritis",
      "Gruodis",
    ];
    return monthNames.map((month, index) => (
      <option key={index} value={index}>
        {month}
      </option>
    ));
  };

  // Function to generate the calendar grid
  const generateCalendarGrid = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(
      selectedDate.getMonth(),
      selectedDate.getFullYear(),
    );
    const firstDayOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    ).getDay();

    // Get the current date
    const currentDate = new Date();

    const grid: JSX.Element[] = [];

    // Generate cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDateObj = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i,
      );

      // Check if the current day is in any of the completionDates
      const isCompletionDay = completionDates?.some((completionDate) => {
        const completionDateObj = new Date(completionDate);
        return (
          currentDate <= currentDateObj && currentDateObj <= completionDateObj
        );
      });

      const orderNames = acceptedOrders
        ?.filter((order) => {
          const completionDate = new Date(order.completionDate);
          return (
            currentDate <= currentDateObj && currentDateObj <= completionDate
          );
        })
        .map((order) => order.orderName);

      grid.push(
        <div
          key={`day-${i}`}
          className={`calendar-cell ${
            selectedDate.getDate() === i ? "selected" : ""
          } ${isCompletionDay ? "completion-day" : ""}`}
          onClick={() => handleDateClick(i)}
          onMouseEnter={() => handleMouseEnter(orderNames)}
          onMouseLeave={() => handleMouseLeave()}
          style={{
            border: "1px solid black",
            padding: "10px",
            textAlign: "center",
            width: "40px", // Adjust width as needed
            height: "40px", // Adjust height as needed
            backgroundColor: isCompletionDay ? "red" : "transparent", // Set background color to red for days between current date and completion date
          }}
        >
          {i}
        </div>,
      );
    }
    // Function to handle date selection
    const handleDateClick = (day: number) => {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day),
      );
    };

    // Function to handle mouse enter
    const handleMouseEnter = (orderNames: string[] | undefined) => {
      if (orderNames) {
        setHoveredOrders(orderNames);
      }
    };

    // Function to handle mouse leave
    const handleMouseLeave = () => {
      // Hide tooltip or popover
      console.log("Mouse left");
    };

    // Add empty cells to fill the last row if needed
    const lastRowEmptyCells = (7 - ((daysInMonth + firstDayOfMonth) % 7)) % 7;
    for (let i = 0; i < lastRowEmptyCells; i++) {
      grid.push(
        <div
          key={`empty-${daysInMonth + i}`}
          className="calendar-cell empty"
        ></div>,
      );
    }

    return grid;
  };

  return (
  <div className="flex">
    <div
      className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 flex-grow md:w-[calc(100% - 360px)]"
    >
      <ul className="flex flex-wrap -mb-px border-b border-gray-200">
        <li className="me-2">
          <button className="inline-block p-4 border-custom-800 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300">
            Kalendorius
          </button>
        </li>
      </ul>
      <div className="flex justify-center mt-3">
        <div className="calendar">
          <div className="calendar-header">
            <button
              onClick={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() - 1
                  )
                )
              }
            >
              &lt;
            </button>
            <select
              value={selectedDate.getMonth()}
              onChange={(e) => handleDateChange(e, "month")}
            >
              {generateMonthOptions()}
            </select>
            <select
              value={selectedDate.getFullYear()}
              onChange={(e) => handleDateChange(e, "year")}
            >
              {generateYearOptions()}
            </select>
            <button
              onClick={() =>
                setSelectedDate(
                  new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth() + 1
                  )
                )
              }
            >
              &gt;
            </button>
          </div>
          <div
            className="calendar-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "5px"
            }}
          >
            {generateCalendarGrid()}
          </div>
        </div>
      </div>
    </div>

    <div
      className="p-6 bg-custom-200 text-medium mt-3 mr-3"
      style={{ width: "30%" }}
    >
      <div className="flex justify-end">
        <span className="w-full font-bold py-2 px-8 text-nowrap text-center">
          Užsakymas ties kurio dirbama pažymėtą dieną
          <ul>
            {hoveredOrders.map((orderName, index) => (
              <li key={index}>{orderName}</li>
            ))}
          </ul>
        </span>
      </div>
    </div>
  </div>
);

}

export default Calendar;
