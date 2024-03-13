import { useState, useEffect } from "react";
import WorkCard from "./WorkCard";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = sortedWorkCards.slice(indexOfFirstCard, indexOfLastCard);
  const maxPageAmount = Math.ceil(sortedWorkCards.length / cardsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {expanded && filteredWorkCards.length > 0 ? (
        <>
          <table className="expanded-content-table mt-4 outline outline-1 outline-gray-100">
            <ExpandedTableHeader
              handleSort={handleSort}
              sortOrder={sortOrder}
              sortColumn={sortColumn}
            />
            <tbody>
              {currentCards.map((work, index) => (
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
          <div className="page-buttons flex justify-center mt-2">
            {maxPageAmount > 1 ? (
              <ul className="flex list-none">
                {Array.from({ length: maxPageAmount }).map((_, index) => (
                  <li key={index} className="mx-1">
                    <button
                      className={`w-10 h-8 rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </>
      ) : (
        filteredWorkCards.length <= 0 && <span>No Results Found</span>
      )}
    </>
  );
}
