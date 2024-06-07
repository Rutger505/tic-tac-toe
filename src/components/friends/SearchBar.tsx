interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Readonly<SearchBarProps>) {
  return (
    <input
      type="text"
      placeholder="Search"
      className="w-full p-2 border border-gray-300 rounded-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
