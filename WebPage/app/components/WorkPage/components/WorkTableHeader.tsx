import { MouseEvent, useState } from "react";

import Arrow from "~/assets/icons/Arrow/Arrow";

import SearchBar from "./SeachBar";
interface WorkTableHeaderProps {
  expanded: boolean;
  toggleExpand: (event: MouseEvent<SVGSVGElement, MouseEvent>) => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

export default function WorkTableHeader({
  toggleExpand,
  expanded,
  handleSearch,
  searchQuery,
}: WorkTableHeaderProps) {
  return (
    <div className="work-table-header flex flex-row items-center justify-center w-full">
      <div className="icon-wrapper flex items-center justify-center cursor-pointer">
        <Arrow
          className={`arrow-down mr-1 h-5 w-5 ${!expanded && "-rotate-90"}`}
          onClick={toggleExpand}
        />
      </div>
      <span className="text-nowrap select-none">Darbų sąrašas</span>
      <div className="work-table-options ml-12 w-full">
        <div className="work-table-options-wrapper flex justify-between">
          <SearchBar handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
