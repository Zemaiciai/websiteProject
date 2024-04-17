import { ChangeEvent, useState } from "react";

interface InputProps {
  name: string;
  title: string;
  type: string;
  error: string | undefined;
}

export function CustomInput({ title, name, type, error }: InputProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const hasContent = inputValue ? true : false;

  return (
    <div className="w-full">
      <p className="w-full relative inline-block">
        <input
          name={name}
          type={type}
          autoComplete="on"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          placeholder=" "
          value={inputValue}
          onChange={handleInputChange}
          className={`peer w-full p-2.5 border-2 rounded focus:opacity-100
          ${
            hasContent
              ? "opacity-100  invalid:border-red-500"
              : "opacity-50  invalid:border-red-500"
          }`}
        />
        <label
          className={`px-2.5 pointer-events-none absolute left-1 top-2.5
          ease-in-out duration-300          
          peer-focus:scale-75
          peer-focus:-translate-y-[95%]
          peer-focus:-translate-x-1.5
          peer-focus:opacity-100
          peer-focus:text-custom-850
          peer-focus:font-bold
          perr-focus:top-1
          peer-focus:bg-white
          ${
            hasContent
              ? "scale-75 -translate-y-[95%] -translate-x-1.5 opacity-100 bg-white top-1"
              : "opacity-50"
          }`}
        >
          {title}
        </label>
        {error ? (
          <span className="font-bold text-red-400" id={`${name}-error`}>
            {error}
          </span>
        ) : null}
      </p>
    </div>
  );
}
