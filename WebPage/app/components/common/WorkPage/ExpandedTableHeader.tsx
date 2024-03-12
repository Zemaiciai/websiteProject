import Arrow from "~/assets/icons/Arrow/Arrow";

interface TableHeaderCellProps {
  column: string;
  title: string;
  handleSort: (column: string) => void;
  sortOrder: string;
  sortColumn: string | null;
}

function TableHeaderCell({
  column,
  title,
  handleSort,
  sortOrder,
  sortColumn,
}: TableHeaderCellProps) {
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

interface ExpandedTableHeaderProps {
  handleSort: (column: string) => void;
  sortOrder: string;
  sortColumn: string | null;
}

export default function ExpandedTableHeader({
  handleSort,
  sortOrder,
  sortColumn,
}: ExpandedTableHeaderProps) {
  return (
    <thead className="expanded-content-table-header bg-white">
      <tr>
        <TableHeaderCell
          column="name"
          title="Pavadinimas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <TableHeaderCell
          column="status"
          title="Statusas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <TableHeaderCell
          column="startDate"
          title="Pradižios data"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <TableHeaderCell
          column="endDate"
          title="Pabaigos data"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
      </tr>
    </thead>
  );
}
