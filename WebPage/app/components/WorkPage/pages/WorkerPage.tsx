import { useState } from "react";

import ArrowDown from "~/assets/icons/ArrowDown/ArrowDown";

import WorkCard from "../components/WorkCard";

export default function WorkPageWorker() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const numberOfWorkCards = 100;

  return (
    <div className="main">
      <div className="work-list flex flex-col bg-slate-300 p-2">
        <div className="work-list-header flex flex-row">
          <div className="icon-wrapper flex items-center justify-center cursor-pointer">
            <ArrowDown
              className="arrow-down mr-1 h-5 w-5"
              onClick={toggleExpand}
            />
          </div>
          Work list
        </div>
        {expanded ? (
          <table className="expanded-content-table mt-4 outline outline-1 outline-gray-100">
            <thead className="expanded-content-table-header bg-white">
              <tr>
                <th scope="col">Pavadinimas</th>
                <th scope="col">Statusas</th>
                <th scope="col">Pradžios data</th>
                <th scope="col">Pabaigos data</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(numberOfWorkCards)].map((index) => (
                <WorkCard
                  key={index}
                  workName={"Darbo Pavadinimas"}
                  workStatus={"Baigtas"}
                  startDate={new Date()}
                  // completionDate={new Date()} // OPTIONAL
                />
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
