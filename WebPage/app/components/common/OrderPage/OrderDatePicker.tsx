import { forwardRef } from "react";

interface OrderDatePickerProps {
  title: string;
  name: string;
  selectedDate: Date;
  handleDateChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string,
    dateName: string,
  ) => void;
}

const OrderDatePicker = forwardRef<HTMLInputElement, OrderDatePickerProps>(
  ({ title, name, selectedDate, handleDateChange }, ref) => {
    const currentDate = new Date();
    const maxDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();

    return (
      <div className="w-full md:w-1/2 px-3 mb-4">
        <div>
          <input
            name={name}
            ref={ref}
            value={selectedDate?.toLocaleDateString()}
            readOnly={true}
            hidden
          />
          <span>{title}</span>
        </div>
        <div className="flex w-min grow justify-between">
          <label className="">
            <select
              value={selectedDate.getDate()}
              onChange={(e) => handleDateChange(e, "day", name)}
              className="cursor-pointer focus:outline-none appearance-none"
            >
              {[...Array(maxDays - currentDate.getDate() + 1).keys()].map(
                (day) => (
                  <option
                    key={day + currentDate.getDate()}
                    value={day + currentDate.getDate()}
                  >
                    {day + currentDate.getDate()}
                  </option>
                ),
              )}
            </select>
          </label>
          <span>/</span>
          <label className="flex">
            <select
              value={selectedDate.getMonth() + 1}
              onChange={(e) => handleDateChange(e, "month", name)}
              className="cursor-pointer focus:outline-none appearance-none"
            >
              {[...Array(12 - currentDate.getMonth()).keys()].map((month) => (
                <option
                  key={month + currentDate.getMonth() + 1}
                  value={month + currentDate.getMonth() + 1}
                >
                  {month + currentDate.getMonth() + 1}
                </option>
              ))}
            </select>
          </label>
          <span>/</span>
          <label className="flex">
            <select
              value={selectedDate.getFullYear()}
              onChange={(e) => handleDateChange(e, "year", name)}
              className="cursor-pointer focus:outline-none appearance-none"
            >
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
        </div>
      </div>
    );
  },
);

export default OrderDatePicker;
