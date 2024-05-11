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
    <th scope="col" className="p-4">
      <span
        className="cursor-pointer select-none flex text-center"
        onClick={() => handleSort(column)}
      >
        {title}
        <div className="icon-wrapper relative cursor-pointer ">
          <Arrow
            className={`h-3 w-3 left-2 top-0.5 absolute ${
              sortColumn !== column && "hidden"
            } ${sortOrder === "asc" && "rotate-180"}`}
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
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
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
