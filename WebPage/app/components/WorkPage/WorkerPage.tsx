import { useState } from "react";

import ExpandedContentTable from "../common/WorkPage/ExpandedTable";
import WorkTableHeader from "../common/WorkPage/WorkPageHeader";

export default function WorkPageWorker() {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    !expanded && setExpanded(true);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const numberOfWorkCards = 100;

  const workCardsArray = Array.from(
    { length: numberOfWorkCards },
    (_, index) => {
      const endDate = new Date();
      endDate.setUTCMinutes(endDate.getUTCMinutes() + (index + 1));
      return {
        orderedBy: `User${index + 1}`,
        workName: `Work${index + 1}`,
        workStatus: index % 2 === 0 ? "Baigtas" : "Daromas",
        completionDate: endDate,
      };
    },
  );

  return (
    <div className="work-page-container flex justify-center flex-col bg-gray-300 p-2">
      <WorkTableHeader
        toggleExpand={toggleExpand}
        expanded={expanded}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <ExpandedContentTable
        workCards={workCardsArray}
        expanded={expanded}
        searchQuery={searchQuery}
      />
    </div>
  );
}
