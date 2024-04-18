interface InputProps {
  name: string;
  title: string;
  type: string;
  error: string | undefined;
}

export function CustomInput({ title, name, type, error }: InputProps) {
  return (
    <div className="w-full">
      <p className="w-full relative inline-block">
        <input
          name={name}
          type={type}
          autoComplete="on"
          placeholder=" "
          className={`peer w-full p-1.5 border-2 border-grey-500 rounded 
          [&:not(:focus):not(:placeholder-shown)]:border-custom-800
          focus:opacity-100
           ${error ? "border-red-400 font-bold opacity-100" : ""}
          `}
        />
        <label
          className={`
          opacity-50 px-1.5 pointer-events-none absolute left-1 top-1.5 ease-in-out duration-300          
          peer-focus:scale-75
          peer-focus:-translate-y-[85%]
          peer-focus:-translate-x-1.5
          peer-focus:text-custom-850
          peer-focus:font-bold
          peer-focus:opacity-100
          peer-focus:top-1
          peer-focus:bg-white
          peer-[&:not(:focus):not(:placeholder-shown)]:scale-75
          peer-[&:not(:focus):not(:placeholder-shown)]:-translate-y-[85%]
          peer-[&:not(:focus):not(:placeholder-shown)]:-translate-x-1.5
          peer-[&:not(:focus):not(:placeholder-shown)]:opacity-100
          peer-[&:not(:focus):not(:placeholder-shown)]:bg-white
          peer-[&:not(:focus):not(:placeholder-shown)]:top-1
          peer-[&:not(:focus):not(:placeholder-shown)]:text-custom-850
          `}
        >
          {title}
        </label>
        {error && (
          <span className="font-bold text-red-400" id={`${name}-error`}>
            {error}
          </span>
        )}
      </p>
    </div>
  );
}
