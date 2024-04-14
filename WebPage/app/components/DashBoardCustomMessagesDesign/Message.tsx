interface MessageProps {
  msg: string;
  priority: string;
}

export default function Message({ msg, priority }: MessageProps) {
  let priorityClassName = "";

  switch (priority) {
    case "1":
      priorityClassName = "text-green-800 border border-green-300 bg-green-50";
      break;
    case "2":
      priorityClassName =
        "text-yellow-800 border border-yellow-300 bg-yellow-50";
      break;
    case "3":
      priorityClassName = "text-red-800 border border-red-300 bg-red-50";
      break;
  }

  return (
    <div
      id="alert-border-3"
      className={`flex items-center p-4 mb-2 rounded-lg m-2 ${priorityClassName}`}
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div className="ms-3 text-sm font-medium">{msg}</div>
    </div>
  );
}
