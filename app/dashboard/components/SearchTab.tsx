"use client";
import { useState, useMemo } from "react";
import _debounce from "lodash/debounce";

import Search from "@/components/Search";
import Button from "@/components/Button";
import { useToast } from "@/components/ui/use-toast";
import fetchQuery from "@/service/fetchQuery";

const SearchTab = () => {
  const [response, setResponse] = useState<any>({ data: [] });
  const [userQuery, setUserQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleChange = (e: any) => {
    setUserQuery(e.target.value);
  };

  const handleButtonClick = async () => {
    if (userQuery === "" || loading) return;
    setLoading(true);
    try {
      const { response: searchResult, error } = await fetchQuery(userQuery);
      setResponse(searchResult);
      if (error) {
        toast({
          title: "Failed to fetch query",
          description: error,
        });
      }
    } catch (error: any) {
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
        <Search
          className="w-full"
          onChange={handleChange}
          handleEnterKey={handleButtonClick}
        />
        <Button onClick={handleButtonClick} className="ml-4" disabled={loading}>
          Search
        </Button>
      </div>
      {response?.hits?.total?.value && (
        <p className="text-sm text-gray-400 flex py-2 w-full">
          Total data objects found: {response.hits.total.value}
        </p>
      )}
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
