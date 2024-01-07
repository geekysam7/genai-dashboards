"use client";
import { useState, useMemo } from "react";
import _debounce from "lodash/debounce";

import Search from "@/components/Search";
import Button from "@/components/Button";

import fetchQuery from "@/service/fetchQuery";

const SearchTab = () => {
  const [response, setResponse] = useState<any>({ data: [] });
  const [userQuery, setUserQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: any) => {
    setUserQuery(e.target.value);
  };

  const handleButtonClick = async () => {
    if (userQuery === "") return;
    setLoading(true);
    try {
      const searchResult = await fetchQuery(userQuery);
      setResponse(searchResult);
    } catch (error) {
      setResponse("");
    }
    setLoading(false);
  };

  const parsedResponse = useMemo(
    () => JSON.stringify(response, null, 4),
    [response]
  );

  return (
    <div className="flex items-center space-x-2 flex-col">
      <div className="flex w-full">
        <Search className="w-full" onChange={handleChange} />
        <Button onClick={handleButtonClick} className="ml-4">
          Search
        </Button>
      </div>
      <div className="w-full p-4 border-2 bg-gray-100 mt-4 rounded-md border-gray-100 min-h-96">
        {loading ? (
          <div>Loading...</div>
        ) : parsedResponse ? (
          <pre>
            <code>{parsedResponse}</code>
          </pre>
        ) : (
          <p>No response</p>
        )}
      </div>
    </div>
  );
};

export default SearchTab;
