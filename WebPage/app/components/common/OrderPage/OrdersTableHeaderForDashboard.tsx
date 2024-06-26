import Arrow from "~/assets/icons/Arrow/Arrow";

interface OrderTableHeaderCellProps {
  column: string;
  title: string;
}

function OrderTableHeaderCell({ column, title }: OrderTableHeaderCellProps) {
  return (
    <th scope="col" className="p-4">
      <span className=" select-none flex">{title}</span>
    </th>
  );
}

export default function OrderTableHeader() {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
      <tr>
        <OrderTableHeaderCell column="orderedBy" title="Užsakymą sukurė" />
        <OrderTableHeaderCell column="name" title="Pavadinimas" />
        <OrderTableHeaderCell column="status" title="Statusas" />
        <OrderTableHeaderCell column="endDate" title="Likęs Laikas" />
      </tr>
    </thead>
  );
}
