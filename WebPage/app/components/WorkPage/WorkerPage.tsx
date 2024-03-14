import { useState } from "react";

import JobsPageHeader from "../common/WorkPage/JobsPageHeader";
import JobsTable from "../common/WorkPage/JobsTable";
import NavBar from "../common/NavBar/NavBar";
import NavBarHeader from "../common/NavBar/NavBarHeader";

export default function WorkPageWorker() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    console.log(activeTab);
  };

  const numberOfWorkCards = 100;

  const workCardsArray = Array.from(
    { length: numberOfWorkCards },
    (_, index) => {
      const endDate = new Date();
      endDate.setUTCMinutes(endDate.getUTCMinutes() + (index + 1));
      return {
        orderedBy: `User${index + 1}`,
        workName: `Work${index + 1}`,
        workStatus: index % 2 === 0 ? "Baigtas" : "Daromas",
        completionDate: endDate,
      };
    },
  );

  workCardsArray[0].completionDate.setMonth(
    workCardsArray[0].completionDate.getMonth() + 1,
  );

  return (
    <div className="jobs-page-container flex h-screen bg-custom-100">
      <div className="navbar-container">
        <NavBar
          title={"Jobs"}
          handleTabClick={handleTabClick}
          redirectTo={"work"}
          activeTab={activeTab}
          tabTitles={["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]}
        />
      </div>
      <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto pb-3">
        <NavBarHeader title="Darbų sąrašas" />
        <div className="h-full w-full flex">
          <div className="jobs-page-table-container flex justify-center flex-col w-3/4 bg-custom-200 ml-3 p-2 ">
            <JobsPageHeader
              handleSearch={handleSearch}
              searchQuery={searchQuery}
            />
            <JobsTable workCards={workCardsArray} searchQuery={searchQuery} />
          </div>
          <div className="customer-and-worker-options rm-4 flex-grow flex justify-center place-items-start">
            <div className="flex flex-col">
              {/* TODO: Kai paspaudžiami šį mygtuką turetu redirectint i psl kur butu galimą sukurti orderį */}
              <button className="">Sukurti orderį</button>
              {/* TODO: Sukurti priminimu lentele darbuotojui bei užsakovui (greitai pasibaigiantys darbai, 
                nesenei pabaigti darbai) */}
              <h1>PRIMINIMU LENTELE</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
