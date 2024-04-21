import { useEffect, useState } from "react";

interface OrderDatePickerProps {
  title: string;
  name: string;
  selectedDate: Date | null;
  error?: string;
  handleDateChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string,
    dateName: string,
  ) => void;
}

const OrderDatePicker = ({
  title,
  name,
  selectedDate,
  handleDateChange,
  error,
}: OrderDatePickerProps) => {
  const currentDate = new Date();
  const [maxDays, setMaxDays] = useState<number>(31);

  useEffect(() => {
    let newMaxDays: number | null;
    if (selectedDate) {
      newMaxDays = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
      ).getDate();
    } else {
      newMaxDays = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      ).getDate();
    }

    setMaxDays(newMaxDays);
  }, [selectedDate]);

  return (
    <div className="w-full md:w-1/2 px-3 mb-5">
      <div>
        <input
          name={name}
          value={selectedDate?.toLocaleString()}
          readOnly={true}
          hidden
        />
        {error ? (
          <div className="pt-1 font-bold text-red-400" id={`${name}-error`}>
            {error}
          </div>
        ) : null}
        <span>{title}</span>
      </div>
      <div className="flex items-center">
        <div className="flex">
          <label>
            <select
              onChange={(e) => handleDateChange(e, "year", name)}
              className="cursor-pointer focus:outline-none rounded border border-gray-500 px-1 text-lg focus:outline-none"
            >
              <option value="" disabled selected hidden>
                YYYY
              </option>
              {[...Array(2).keys()].map((year) => (
                <option
                  key={year + currentDate.getFullYear()}
                  value={year + currentDate.getFullYear()}
                >
                  {year + currentDate.getFullYear()}
                </option>
              ))}
            </select>
          </label>
          <span>/</span>
          <label>
            <select
              onChange={(e) => handleDateChange(e, "month", name)}
              className="cursor-pointer focus:outline-none  rounded border border-gray-500 px-1 text-lg focus:outline-none"
            >
              <option defaultValue="" disabled selected hidden>
                MM
              </option>
              {[...Array(12).keys()].map((month) => (
                <option key={month + 1} value={month + 1}>
                  {String(month + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
          <span>/</span>
          <label>
            <select
              onChange={(e) => handleDateChange(e, "day", name)}
              className="cursor-pointer focus:outline-none w-14 rounded border border-gray-500 px-1 text-lg focus:outline-none"
            >
              <option value="" disabled selected hidden>
                DD
              </option>
              {[...Array(maxDays).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {String(day + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex pl-4">
          <label className="flex w-full rounded border border-gray-500 px-1 text-lg focus:outline-none placeholder-black">
            <select
              onChange={(e) => handleDateChange(e, "hour", name)}
              className="cursor-pointer focus:outline-none"
            >
              <option value="" disabled selected hidden>
                Valandos
              </option>
              {[...Array(24).keys()].map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OrderDatePicker;
