import Arrow from "~/assets/icons/Arrow/Arrow";

interface OrderTableHeaderCellProps {
  column: string;
  title: string;
  handleSort: (column: string) => void;
  sortOrder: string;
  sortColumn: string | null;
}

function OrderTableHeaderCell({
  column,
  title,
  handleSort,
  sortOrder,
  sortColumn,
}: OrderTableHeaderCellProps) {
  return (
    <th scope="col">
      <span
        className="cursor-pointer select-none flex items-center justify-center"
        onClick={() => handleSort(column)}
      >
        {title}
        <div className="icon-wrapper flex flex-row items-center justify-center cursor-pointer pl-2">
          <Arrow
            className={`h-3 w-3 absolute ${sortColumn !== column && "hidden"} ${
              sortOrder === "asc" && "rotate-180"
            }`}
          />
        </div>
      </span>
    </th>
  );
}

interface OrderTableHeaderProps {
  handleSort: (column: string) => void;
  sortOrder: string;
  sortColumn: string | null;
}

export default function OrderTableHeader({
  handleSort,
  sortOrder,
  sortColumn,
}: OrderTableHeaderProps) {
  return (
    <thead className="table-header bg-white">
      <tr>
        <OrderTableHeaderCell
          column="orderedBy"
          title="Užsakymą sukurė"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <OrderTableHeaderCell
          column="name"
          title="Pavadinimas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <OrderTableHeaderCell
          column="status"
          title="Statusas"
          handleSort={handleSort}
          sortOrder={sortOrder}
          sortColumn={sortColumn}
        />
        <OrderTableHeaderCell
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
