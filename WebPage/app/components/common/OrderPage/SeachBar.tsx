import SearchIcon from "~/assets/icons/SearchIcon/SearchIcon";

interface SearchBarProps {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

export default function SearchBar({
  handleSearch,
  searchQuery,
}: SearchBarProps) {
  return (
    <div className="search-bar-container flex flex-row bg-white p-1 w-[25rem]">
      <div className="icon-wrapper flex items-center justify-center mr-1">
        <SearchIcon className="w-4 h-4" />
      </div>
      <div className="input-wraper w-full flex items-center justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="flex-grow outline-none w-full"
        />
      </div>
    </div>
  );
}
