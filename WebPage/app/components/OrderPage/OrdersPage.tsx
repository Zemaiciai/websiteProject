import { useEffect, useState } from "react";

import OrdersTable from "../common/OrderPage/OrdersTable";
import NavBar from "../common/NavBar/NavBar";
import NavBarHeader from "../common/NavBar/NavBarHeader";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { Order } from "@prisma/client";

interface OrdersPageProps {
  orders: Order[] | null;
}

export default function OrdersPage({ orders }: OrdersPageProps) {
  const [activeTab, setActiveTab] = useState("");
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {
      mainTable: "",
      importantTable: "",
    },
  );
  const [linkClicked, setLinkClicked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/orders") {
      setLinkClicked(false);
    }
  }, [location.pathname]);

  const handleLinkClick = () => {
    setLinkClicked(true);
  };

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
    tableName: string,
  ) => {
    setSearchQueries({
      ...searchQueries,
      [tableName]: event.target.value,
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="jobs-page-container flex h-screen bg-custom-100">
      <div className="navbar-container">
        <NavBar
          title={"Orders"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={activeTab}
          tabTitles={["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]}
        />
      </div>
      <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto pb-3">
        <NavBarHeader
          title={`${linkClicked ? "Užsakymo sukurimas" : "Darbų sąrašas"}`}
        />
        <main className="h-full w-full flex">
          {linkClicked ? (
            <Outlet />
          ) : (
            <div className="flex m-4 py-4 bg-custom-200 w-full">
              <div>
                <div className="jobs-page-table-container flex-grow flex justify-center place-items-start">
                  <OrdersTable
                    orderCards={orders}
                    handleSearch={(event) => handleSearch(event, "mainTable")}
                    searchQuery={searchQueries.mainTable}
                    title={"Darbų sąrašas"}
                  />
                </div>
              </div>

              <div className="customer-and-orderer-options flex-grow flex justify-center place-items-start">
                <div className="flex flex-col w-full">
                  <div className="flex button justify-center mb-4">
                    {/*TODO: in the future goto a page where you can create an order*/}
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
                    handleSearch={(event) =>
                      handleSearch(event, "importantTable")
                    }
                    searchQuery={searchQueries.importantTable}
                    important={true}
                    title={"Priminimų sąrašas"}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
