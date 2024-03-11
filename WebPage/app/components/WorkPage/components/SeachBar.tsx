import { useState } from "react";

import SearchIcon from "~/assets/icons/SearchIcon/SearchIcon";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);

    console.log(searchQuery);
  };

  return (
    <div className="search-bar-container flex flex-row bg-white p-1 w-[25rem]">
      <div className="icon-wrapper flex items-center justify-center mr-1">
        <SearchIcon className="w-4 h-4 cursor-pointer" />
      </div>
      <div className="input-wraper w-full flex items-center justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search..."
          className="flex-grow outline-none w-full"
        />
      </div>
      <button
        className="search-button ml-1 p-1 border-2 border-gray-500"
        onClick={handleInputChange}
      >
        serach
      </button>
    </div>
  );
}
