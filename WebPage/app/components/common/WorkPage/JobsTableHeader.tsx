import Arrow from "~/assets/icons/Arrow/Arrow";

interface JobsJobsTableHeaderCellProps {
  column: string;
  title: string;
  handleSort: (column: string) => void;
  sortOrder: string;
  sortColumn: string | null;
}

function JobsTableHeaderCell({
  column,
  title,
  handleSort,
  sortOrder,
  sortColumn,
}: JobsJobsTableHeaderCellProps) {
  return (
    <th scope="col">
      <span
        className="cursor-pointer select-none flex items-center justify-center"
        onClick={() => handleSort(column)}
      >
        {title}
        <div className="icon-wrapper flex flex-row items-center justify-center cursor-pointer pl-2">
          <Arrow
            className={`h-3 w-3 absolute ${sortColumn !== column && "hidden"} ${sortOrder === "asc" && "rotate-180"}`}
          />
        </div>
      </span>
    </th>
  );
}

interface JobsTableHeaderProps {
  handleSort: (column: string) => void;
  sortOrder: string;
  sortColumn: string | null;
}

export default function JobsTableHeader(
  { handleSort }: JobsTableHeaderProps,
  { sortOrder, sortColumn },
) {
  return (
    <thead className="expanded-content-table-header bg-white">
      <tr>
        <JobsTableHeaderCell
          column="orderedBy"
          title="Užsakymas sukurtas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <JobsTableHeaderCell
          column="name"
          title="Pavadinimas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <JobsTableHeaderCell
          column="status"
          title="Statusas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <JobsTableHeaderCell
          column="endDate"
          title="Likęs Laikas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
      </tr>
    </thead>
  );
}
