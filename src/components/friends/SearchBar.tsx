import { SearchIcon } from "@/components/icons/SearchIcon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Readonly<SearchBarProps>) {
  return (
    <div className="flex items-center w-full border border-gray-300 rounded-full box-border">
      <SearchIcon className={" pl-4 h-4 "} />
      <input
        className={"p-2 px-4 outline-0 flex-grow bg-transparent"}
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
