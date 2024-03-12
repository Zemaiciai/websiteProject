import { useState } from "react";
import WorkCard from "./WorkCard";
import Arrow from "~/assets/icons/Arrow/Arrow";
import ExpandedTableHeader from "./ExpandedTableHeader";

interface WorkCard {
  workName: string;
  workStatus: string;
  startDate: Date;
  completionDate?: Date;
}

interface ExpandedTable {
  expanded: boolean;
  workCards: WorkCard[];
  searchQuery: string;
}

export default function ExpandedTable({
  expanded,
  workCards,
  searchQuery,
}: ExpandedTable) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  workCards[0].workStatus = "A";
  workCards[1].workStatus = "B";
  workCards[2].workStatus = "C";

  workCards[0].workName = "C";
  workCards[1].workName = "A";
  workCards[2].workName = "B";

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredWorkCards = workCards.filter((work) =>
    work.workName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedWorkCards = [...filteredWorkCards].sort((a, b) => {
    switch (sortColumn) {
      case "name":
        return sortOrder === "asc"
          ? a.workName.localeCompare(b.workName)
          : b.workName.localeCompare(a.workName);
      case "status":
        return sortOrder === "asc"
          ? a.workStatus.localeCompare(b.workStatus)
          : b.workStatus.localeCompare(a.workStatus);
      case "startDate":
        return sortOrder === "asc"
          ? a.startDate.getTime() - b.startDate.getTime()
          : b.startDate.getTime() - a.startDate.getTime();
      case "endDate":
        if (a.completionDate && b.completionDate) {
          return sortOrder === "asc"
            ? a.completionDate.getTime() - b.completionDate.getTime()
            : b.completionDate.getTime() - a.completionDate.getTime();
        } else if (a.completionDate) {
          return sortOrder === "asc" ? -1 : 1;
        } else if (b.completionDate) {
          return sortOrder === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      default:
        return 0;
    }
  });

  return (
    <>
      {expanded && filteredWorkCards.length > 0 ? (
        <table className="expanded-content-table mt-4 outline outline-1 outline-gray-100">
          <ExpandedTableHeader
            handleSort={handleSort}
            sortOrder={sortOrder}
            sortColumn={sortColumn}
          />
          <tbody>
            {sortedWorkCards.map((work, index) => (
              <WorkCard
                key={index}
                workName={work.workName}
                workStatus={work.workStatus}
                startDate={work.startDate}
                completionDate={work.completionDate}
              />
            ))}
          </tbody>
        </table>
      ) : (
        filteredWorkCards.length <= 0 && <span>No Results Found</span>
      )}
    </>
  );
}
