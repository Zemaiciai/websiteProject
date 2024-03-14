import { useState } from "react";

import JobsPageHeader from "../common/WorkPage/JobsPageHeader";
import JobsTable from "../common/WorkPage/JobsTable";
import NavBar from "../common/NavBar/NavBar";

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
    <div className="jobs-page-container flex w-full">
      <NavBar
        title={"Jobs"}
        handleTabClick={handleTabClick}
        redirectTo={"work"}
        activeTab={activeTab}
        tabTitles={["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]}
      />
      <div className="jobs-page-table-container flex justify-center flex-col bg-gray-300 p-2 w-full">
        <JobsPageHeader handleSearch={handleSearch} searchQuery={searchQuery} />
        <JobsTable workCards={workCardsArray} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
