import { useState } from "react";

import ExpandedContentTable from "../components/ExpandedContentTable";
import WorkTableHeader from "../components/WorkTableHeader";

export default function WorkPageWorker() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const numberOfWorkCards = 100;

  return (
    <div className="work-page-container flex justify-center flex-col bg-slate-300 p-2">
      <WorkTableHeader toggleExpand={toggleExpand} />
      <ExpandedContentTable
        numberOfWorkCards={numberOfWorkCards}
        expanded={expanded}
      />
    </div>
  );
}
