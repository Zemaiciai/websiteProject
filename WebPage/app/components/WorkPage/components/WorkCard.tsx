interface WorkCardProps {
    workName: string;
    workStatus: string;
    completionDate?: Date;
    startDate: Date;
}

export default function WorkCard({workName, workStatus, completionDate, startDate}: WorkCardProps) {
  return (
    <tr className="work-card-row bg-white outline outline-1 outline-gray-100">
        <td className="work-name text-center max-w-[100px] truncate ...">
            {workName}
        </td>
        <td className="work-status text-center truncate ...">{workStatus}</td>
        <td className="start-date text-center truncate ...">{startDate.toDateString()}</td>
        <td className="completion-date text-center truncate ...">{completionDate?.toDateString()}</td>
    </tr>
  );
}
