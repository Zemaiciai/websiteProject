import Arrow from "~/assets/icons/Arrow/Arrow";

interface OrderTableHeaderCellProps {
  column: string;
  title: string;
}

function OrderTableHeaderCell({ column, title }: OrderTableHeaderCellProps) {
  return (
    <th scope="col">
      <span className="cursor-pointer select-none flex items-center justify-center">
        {title}
      </span>
    </th>
  );
}

export default function OrderTableHeader() {
  return (
    <thead className="table-header bg-white">
      <tr>
        <OrderTableHeaderCell column="orderedBy" title="Užsakymą sukurė" />
        <OrderTableHeaderCell column="name" title="Pavadinimas" />
        <OrderTableHeaderCell column="status" title="Statusas" />
        <OrderTableHeaderCell column="endDate" title="Likęs Laikas" />
      </tr>
    </thead>
  );
}
