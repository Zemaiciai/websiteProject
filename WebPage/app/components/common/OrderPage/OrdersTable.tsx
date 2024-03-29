import { useState, useEffect, ChangeEvent } from "react";
import OrderTableRow from "./OrderTableRow";
import OrdersTableHeader from "./OrdersTableHeader";
import OrderPageHeader from "./OrderPageHeader";

interface OrderCard {
  orderedBy: string;
  orderName: string;
  orderStatus: string;
  completionDate: Date;
}

interface OrdersTableProps {
  orderCards: OrderCard[];
  searchQuery: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  important?: boolean;
  title: string;
}

export default function OrdersTable({
  orderCards,
  searchQuery,
  important,
  handleSearch,
  title,
}: OrdersTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 10;
  const ONE_HOUR_IN_MS = 60 * 60 * 1000;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortOrder(sortColumn === column && sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredOrderCards = orderCards.filter((order) =>
    order.orderName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  let imporantCardsAmount = 0;

  orderCards.map((order) => {
    const endInMs = order.completionDate.getTime() - Date.now();
    if (endInMs <= ONE_HOUR_IN_MS) {
      imporantCardsAmount++;
    }
  });

  let sortedOrderCards = [...filteredOrderCards]
    .filter((order) => {
      if (important) {
        const endInMs = order.completionDate.getTime() - Date.now();
        return endInMs <= ONE_HOUR_IN_MS;
      }
      return true;
    })
    .sort((a, b) => {
      if (important) {
        const endInMsA = a.completionDate.getTime() - Date.now();
        const endInMsB = b.completionDate.getTime() - Date.now();

        if (endInMsA !== endInMsB) {
          return sortOrder === "asc"
            ? endInMsA - endInMsB
            : endInMsB - endInMsA;
        }
      }
      const order = sortOrder === "asc" ? 1 : -1;
      switch (sortColumn) {
        case "orderedBy":
          return order * a.orderedBy.localeCompare(b.orderedBy);
        case "name":
          return order * a.orderName.localeCompare(b.orderName);
        case "status":
          return order * a.orderStatus.localeCompare(b.orderStatus);
        case "endDate":
          return (
            order * (a.completionDate.getTime() - b.completionDate.getTime())
          );
        default:
          return 0;
      }
    });

  const maxPageAmount = Math.ceil(sortedOrderCards.length / cardsPerPage);
  const currentCards = sortedOrderCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  );

  console.log(imporantCardsAmount);

  return (
    <>
      {imporantCardsAmount === 0 && important ? (
        <span className="text-center">There are no important orders</span>
      ) : (
        <div className="table-container flex flex-col h-full overflow-auto bg-custom-200 p-2 m-2">
          <OrderPageHeader
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            title={title}
          />
          {filteredOrderCards.length > 0 ? (
            <div className="table-wrapper flex flex-col h-full overflow-auto">
              <table className="expanded-content-table mt-4 outline outline-1 outline-gray-100 h-full w-full">
                <OrdersTableHeader
                  handleSort={handleSort}
                  sortOrder={sortOrder}
                  sortColumn={sortColumn}
                />
                <tbody className="h-max">
                  {currentCards.map((order, index) => (
                    <OrderTableRow
                      key={index}
                      orderedBy={order.orderedBy}
                      orderName={order.orderName}
                      completionDate={order.completionDate}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <span>No Results Found</span>
          )}
          {maxPageAmount > 1 && (
            <div className="page-buttons flex justify-center mt-2">
              <ul className="flex list-none">
                {Array.from({ length: maxPageAmount }).map((_, index) => (
                  <li key={index} className="mx-1">
                    <button
                      className={`w-10 h-8 rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
