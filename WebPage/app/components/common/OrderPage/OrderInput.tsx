import { ChangeEvent, useState } from "react";

interface OrderInputProps {
  title: string;
  error?: string;
  name: string;
  bigger?: boolean;
  defaultValue?: string;
}

export default function OrderInput({
  title,
  name,
  error,
  bigger,
  defaultValue,
}: OrderInputProps) {
  const [currentLenght, setCurrentLength] = useState(0);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setCurrentLength(inputValue.length);
  };

  return (
    <div className={`w-full ${bigger && "h-44"} md:w-1/2 px-3 mb-6`}>
      {error ? (
        <div
          className="pt-1 font-bold text-red-400 bottom-9"
          id={`${name}-error`}
        >
          {error}
        </div>
      ) : null}
      <div className="flex flex-col h-full">
        <div className="relative h-full">
          {bigger ? (
            <div className="flex flex-col h-full text-right">
              <span className={`${500 - currentLenght < 0 && "text-red-500"}`}>
                {500 - currentLenght}
              </span>
              <textarea
                name={name}
                onChange={(e) => handleChange(e)}
                placeholder="Aprašymas"
                className="w-full h-full resize-none rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black "
                defaultValue={defaultValue}
              />
            </div>
          ) : (
            <input
              name={name}
              type="text"
              autoComplete="on"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
              placeholder={title}
              defaultValue={defaultValue}
            />
          )}
        </div>
      </div>
    </div>
  );
}
