import { MouseEvent, useState } from "react";

import Arrow from "~/assets/icons/Arrow/Arrow";

import SearchBar from "./SeachBar";
interface WorkTableHeaderProps {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

export default function WorkTableHeader({
  handleSearch,
  searchQuery,
}: WorkTableHeaderProps) {
  return (
    <div className="work-table-header flex flex-row items-center justify-center w-full">
      <span className="text-nowrap select-none">Darbų sąrašas</span>
      <div className="work-table-options ml-12 w-full">
        <div className="work-table-options-wrapper flex justify-between">
          <SearchBar handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
