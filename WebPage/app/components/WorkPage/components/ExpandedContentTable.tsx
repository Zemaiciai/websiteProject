import { useState } from "react";
import WorkCard from "./WorkCard";

interface WorkCard {
  workName: string;
  workStatus: string;
  startDate: Date;
  completionDate?: Date;
}

interface ExpandedContentTableProps {
  expanded: boolean;
  workCards: WorkCard[];
  searchQuery: string;
}

export default function ExpandedContentTable({
  expanded,
  workCards,
  searchQuery,
}: ExpandedContentTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
      {expanded ? (
        <table className="expanded-content-table mt-4 outline outline-1 outline-gray-100">
          <thead className="expanded-content-table-header bg-white">
            <tr>
              <th scope="col">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                  select-none
                >
                  Pavadinimas
                </span>
              </th>
              <th scope="col">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                  select-none
                >
                  Statusas
                </span>
              </th>
              <th scope="col">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort("startDate")}
                  select-none
                >
                  Pradižios data
                </span>
              </th>
              <th scope="col">
                <span
                  className="cursor-pointer"
                  onClick={() => handleSort("endDate")}
                  select-none
                >
                  Pabaigos data
                </span>
              </th>
            </tr>
          </thead>
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
      ) : null}
    </>
  );
}
