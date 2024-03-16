import { useState } from "react";
import WorkTimer from "./JobTimer";
import useDuration from "~/hooks/useDuration";

interface WorkCardProps {
  orderedBy: string;
  workName: string;
  workStatus: string;
  completionDate: Date;
}

export default function WorkCard({
  workName,
  workStatus,
  completionDate,
  orderedBy,
}: WorkCardProps) {
  const [ended, setEnded] = useState(false);

  const handleWorkEnd = () => {
    setEnded(true);
  };

  console.log(ended + " " + workName);

  return (
    <tr className="work-card-row bg-white outline outline-1 outline-gray-100">
      <td className="work-name text-center max-w-[100px] truncate ...">
        {orderedBy}
      </td>
      <td className="work-name text-center max-w-[100px] truncate ...">
        {workName}
      </td>
      <td className="work-status text-center truncate ...">
        {ended ? "Baigtas" : "Daromas"}
      </td>
      <td className="work-timer text-center truncate ...">
        <WorkTimer workEndDate={completionDate} handleWorkEnd={handleWorkEnd} />
      </td>
    </tr>
  );
}
