import React, { useState, useEffect } from "react";
import OrderTableRow from "./OrderTableRow";
import OrdersTableHeader from "./OrdersTableHeader";
import OrderPageHeader from "./OrderPageHeader";
import { Order, OrderStatus } from "@prisma/client";

interface OrdersTableProps {
  orderCards?: Order[] | null;
  searchQuery: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  important?: boolean;
  activeOnly?: boolean;
  title: string;
}

export default function OrdersTable({
  orderCards,
  searchQuery,
  important,
  handleSearch,
  title,
  activeOnly,
}: OrdersTableProps) {
  if (!orderCards || orderCards.length === 0) {
    return <span>No orders available</span>;
  }

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
    if (order.completionDate instanceof Date) {
      const endInMs = order.completionDate.getTime() - Date.now();
      if (endInMs <= ONE_HOUR_IN_MS) {
        imporantCardsAmount++;
      }
    }
  });

  let sortedOrderCards = [...filteredOrderCards]
    .filter((order) => {
      if (order.orderStatus === OrderStatus.REMOVED) {
        return false;
      }
      if (important && order.completionDate instanceof Date) {
        const endInMs = order.completionDate.getTime() - Date.now();
        return endInMs <= ONE_HOUR_IN_MS;
      } else if (activeOnly) {
        return (
          order.orderStatus === "ACCEPTED" ||
          order.orderStatus === "IN_PROGRESS"
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (
        important &&
        a.completionDate instanceof Date &&
        b.completionDate instanceof Date
      ) {
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
          return order * a.customerId.localeCompare(b.customerId);
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

  if (imporantCardsAmount === 0 && important) {
    return <span className="text-center">There are no important orders</span>;
  }
  return (
    <div>
      <div className="mb-5">
        <OrderPageHeader
          handleSearch={handleSearch}
          searchQuery={searchQuery}
          title={title}
        />
      </div>
      {filteredOrderCards.length > 0 ? (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <div className="table-container flex flex-col h-full overflow-auto bg-custom-200">
            <div className="table-wrapper flex flex-col h-full overflow-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <OrdersTableHeader
                  handleSort={handleSort}
                  sortOrder={sortOrder}
                  sortColumn={sortColumn}
                />
                <tbody>
                  {currentCards.map((order, index) => (
                    <OrderTableRow
                      key={index}
                      order={order}
                      createdBy={order["createdBy"]["userName"]}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <span>No Results Found</span>
      )}
      {maxPageAmount > 1 && (
        <div className="page-buttons flex justify-center mt-6">
          <ul className="flex list-none">
            {Array.from({ length: maxPageAmount }).map((_, index) => (
              <li key={index} className="mx-1">
                <button
                  className={`w-8 h-8 rounded ${
                    currentPage === index + 1
                      ? "bg-custom-850 text-white"
                      : "bg-custom-800 text-white"
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
  );
}
