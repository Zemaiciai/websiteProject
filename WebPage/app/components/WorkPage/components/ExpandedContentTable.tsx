import WorkCard from "./WorkCard";

interface ExpandedContentTableProps{
    expanded: boolean;
    numberOfWorkCards: number;
}

export default function ExpandedContentTable({expanded, numberOfWorkCards}: ExpandedContentTableProps) {
  return (
    <>
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
  </>
  )
}
