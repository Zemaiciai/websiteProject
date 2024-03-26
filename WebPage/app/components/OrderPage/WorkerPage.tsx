import { Link } from "@remix-run/react";
import { useState } from "react";

import NavBar from "../common/NavBar/NavBar";
import NavBarHeader from "../common/NavBar/NavBarHeader";
import OrdersPageHeader from "../common/OrderPage/OrderPageHeader";
import OrdersTable from "../common/OrderPage/OrdersTable";

export default function OrderPageOrderer() {
  const [activeTab, setActiveTab] = useState("");
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
    mainTable: "",
    importantTable: ""
  });

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
    tableName: string
  ) => {
    setSearchQueries({
      ...searchQueries,
      [tableName]: event.target.value
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const numberOfOrderCards = 100;

  // TODO: when we are saving workcards in the databse
  //       use that instead of generating the workcards here
  const orderCardsArray = Array.from(
    { length: numberOfOrderCards },
    (_, index) => {
      const endDate = new Date();
      endDate.setMinutes(endDate.getMinutes() + (index + 1));
      return {
        orderedBy: `User${index + 1}`,
        orderName: `Order${index + 1}`,
        orderStatus: index % 2 === 0 ? "Baigtas" : "Daromas",
        completionDate: endDate
      };
    }
  );

  return (
    <div className="jobs-page-container flex h-screen bg-custom-100">
      <NavBar
        title={"Orders"}
        handleTabClick={handleTabClick}
        redirectTo={"order"}
        activeTab={activeTab}
        tabTitles={[
          "TEST",
          "TEStT",
          "TEaST",
          "TESTb",
          "TESTc",
          "dTEST",
          "TEeST"
        ]}
      />
      <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto pb-3">
        <NavBarHeader title="Darbų sąrašas" />
        <div className="h-full w-full flex">
          <div className="jobs-page-table-container flex justify-center flex-col w-2/4 bg-custom-200 ml-3">
            <OrdersTable
              orderCards={orderCardsArray}
              handleSearch={(event) => handleSearch(event, "mainTable")}
              searchQuery={searchQueries.mainTable}
              title={"Darbų sąrašas"}
            />
          </div>
          <div className="customer-and-orderer-options rm-4 flex-grow flex justify-center place-items-start">
            <div className="flex flex-col w-full">
              <div className="flex button justify-center mb-4">
                {/*TODO: in the future goto a page where you can create an order*/}
                <Link
                  className="flex justify-center px-4 py-3 w-3/4 
                  text-white bg-custom-900 hover:bg-custom-850 
                  transition duration-300 ease-in-out rounded"
                  to={"/createorder"}
                >
                  Sukurti užsakymą
                </Link>
              </div>
              <OrdersTable
                orderCards={orderCardsArray}
                handleSearch={(event) => handleSearch(event, "importantTable")}
                searchQuery={searchQueries.importantTable}
                important={true}
                title={"Priminimų sąrašas"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
