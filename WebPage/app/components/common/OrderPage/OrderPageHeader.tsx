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
    <div className="work-table-header flex flex-row items-center justify-center w-full">
      <span className="text-nowrap select-none">{title}</span>
      <div className="work-table-options ml-12 w-full">
        <div className="work-table-options-wrapper flex justify-between">
          <SearchBar handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
