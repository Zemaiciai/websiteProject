import { MouseEvent } from "react";
import ArrowDown from "~/assets/icons/ArrowDown/ArrowDown";

import SearchBar from "./SeachBar";

interface WorkTableHeaderProps {
    toggleExpand: (event: MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export default function WorkTableHeader({ toggleExpand }: WorkTableHeaderProps) {
  return (
    <div className="work-table-header flex flex-row items-center justify-center w-full">
      <div className="icon-wrapper flex items-center justify-center cursor-pointer">
        <ArrowDown className="arrow-down mr-1 h-5 w-5" onClick={toggleExpand} />
      </div>
      <span className="text-nowrap">Darbų sąrašas</span>
      <div className="work-table-options ml-12 w-full">
        <div className="work-table-options-wrapper flex justify-between">
            <SearchBar />
            <button>SortByDate</button>
            <button>SortByStatus</button>
        </div>
      </div>
    </div>
  );
}
