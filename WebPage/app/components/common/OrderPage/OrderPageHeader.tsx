import SearchBar from "./SeachBar";
interface OrderTableHeaderProps {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  title: string;
}

export default function OrderTableHeader({
  handleSearch,
  searchQuery,
  title,
}: OrderTableHeaderProps) {
  return (
    <div className="order-table-header flex flex-row items-center justify-center w-full">
      <span className="text-nowrap select-none pr-4">{title}</span>
      <div className="order-table-options w-full">
        <div className="order-table-options-wrapper flex justify-between">
          <SearchBar handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
