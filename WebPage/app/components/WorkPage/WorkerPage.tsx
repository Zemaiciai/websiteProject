import { useState } from "react";

import ExpandedContentTable from "../common/WorkPage/ExpandedTable";
import WorkTableHeader from "../common/WorkPage/WorkPageHeader";

export default function WorkPageWorker() {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    !expanded && setExpanded(true);
    if (event.target.value.length === 0) setExpanded(false);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const numberOfWorkCards = 100;

  const workCardsArray = Array.from(
    { length: numberOfWorkCards },
    (_, index) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + index);
      return {
        workName: `Work${index + 1}`,
        workStatus: "Baigtas",
        startDate: startDate,
        completionDate: index % 2 === 0 ? new Date() : undefined,
      };
    },
  );

  return (
    <div className="work-page-container flex justify-center flex-col bg-slate-300 p-2">
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
