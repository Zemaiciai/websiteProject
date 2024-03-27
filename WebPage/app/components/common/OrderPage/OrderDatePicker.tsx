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
    return (
      <div className="w-full md:w-1/2 px-3 mb-6">
        <div>
          <input
            name={name}
            ref={ref}
            value={selectedDate?.toDateString()}
            readOnly={true}
            hidden
          />
          <span>{title}</span>
        </div>
        <div>
          <label>
            Mėnuo:
            <select
              value={selectedDate.getMonth() + 1}
              onChange={(e) => handleDateChange(e, "month", name)}
              className="cursor-pointer focus:outline-none"
            >
              {[...Array(12).keys()].map((month) => (
                <option key={month + 1} value={month + 1}>
                  {month + 1}
                </option>
              ))}
            </select>
          </label>
          <label>
            Diena:
            <select
              value={selectedDate.getDate()}
              onChange={(e) => handleDateChange(e, "day", name)}
              className="cursor-pointer focus:outline-none"
            >
              {[...Array(31).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}
                </option>
              ))}
            </select>
          </label>
          <label>
            Metai:
            <select
              value={selectedDate.getFullYear()}
              onChange={(e) => handleDateChange(e, "year", name)}
              className="cursor-pointer focus:outline-none"
            >
              {[...Array(10).keys()].map((year) => (
                <option key={year + 2021} value={year + 2021}>
                  {year + 2021}
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
