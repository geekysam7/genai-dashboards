import { useCallback } from "react";
import { Input } from "./ui/input";

const Search = ({
  onChange,
  className,
  handleEnterKey,
}: {
  onChange: any;
  className: string;
  handleEnterKey?: Function;
}) => {
  const handleKeyDown = useCallback(
    (e: any) => {
      if (handleEnterKey && e.key === "Enter") {
        handleEnterKey();
      }
    },
    [onChange]
  );
  return (
    <div className={className}>
      <Input
        type="search"
        placeholder="How many apps have reviews greater than 100000?"
        className="w-full"
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Search;
