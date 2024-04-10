import { useEffect, useState } from "react";

import OrdersTable from "../common/OrderPage/OrdersTable";
import NavBar from "../common/NavBar/NavBar";
import NavBarHeader from "../common/NavBar/NavBarHeader";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { Order } from "@prisma/client";

interface OrdersPageProps {
  orders: Order[] | null;
  worker: boolean;
  linkClicked: boolean;
  handleLinkClick: () => void;
}

export default function OrdersPage({
  orders,
  worker,
  linkClicked,
  handleLinkClick,
}: OrdersPageProps) {
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {
      mainTable: "",
      importantTable: "",
    },
  );

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
    tableName: string,
  ) => {
    setSearchQueries({
      ...searchQueries,
      [tableName]: event.target.value,
    });
  };

  return (
    <main className="h-full w-full flex">
      {linkClicked ? (
        <Outlet />
      ) : (
        <div className="flex m-4 py-4 bg-custom-200 w-full">
          <div className="orders-table grow flex justify-center place-items-start">
            <div className="w-full">
              <OrdersTable
                orderCards={orders}
                handleSearch={(event) => handleSearch(event, "mainTable")}
                searchQuery={searchQueries.mainTable}
                title={`${worker ? "Darbų sąrašas" : "Jūsų užsakymų sąrašas"}`}
              />
            </div>
          </div>

          <div className="customer-and-orderer-options flex-grow flex justify-center place-items-start">
            <div className="flex flex-col w-full">
              <div
                className={`flex button justify-center mb-4 ${
                  worker && "hidden"
                }`}
              >
                <Link
                  className="flex justify-center px-4 py-3 w-3/4 
                  text-white bg-custom-900 hover:bg-custom-850 
                  transition duration-300 ease-in-out rounded"
                  to={"new"}
                  onClick={handleLinkClick}
                >
                  Sukurti užsakymą
                </Link>
              </div>
              <OrdersTable
                orderCards={orders}
                handleSearch={(event) => handleSearch(event, "importantTable")}
                searchQuery={searchQueries.importantTable}
                important={true}
                title={"Priminimų sąrašas"}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
