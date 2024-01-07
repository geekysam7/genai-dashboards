import { Input } from "./ui/input";

const Search = ({
  onChange,
  className,
}: {
  onChange: any;
  className: string;
}) => {
  return (
    <div className={className}>
      <Input
        type="search"
        placeholder="How many apps have reviews greater than 100000?"
        className="w-full"
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
