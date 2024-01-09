"use client";

import { useState, useEffect, useMemo } from "react";
import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import _debounce from "lodash/debounce";
import _isEmpty from "lodash/isEmpty";

import Button from "@/components/Button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/Card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { search } from "@/service/fetchQuery";
import { IDasbhboard } from "@/types/app";
import SentimentChart from "@/components/charts/SentimentChart";
import { getSentimentData } from "@/helpers/app";

const AppViewTab = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<IDasbhboard | undefined>(undefined);
  const [results, setResults] = useState<IDasbhboard[]>([]);
  const [initData, setInitData] = useState<IDasbhboard[]>([]);
  const [loading, setLoading] = useState(false);

  const sentimentData = useMemo(() => {
    if (value && value.appSentiment) {
      return getSentimentData(value.appSentiment).data;
    }
    return [];
  }, [value]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await search("");
      setResults(result);
      setInitData(result);
    };

    fetchData();
  }, []);

  const handleSelect = (value: string) => {
    setOpen(false);
    setValue(results.find(({ app }) => app.toLowerCase() === value));
  };

  const fetchResult = async (value: string) => {
    if (!value) {
      setResults(initData);
      return;
    }
    setLoading(true);
    const result = await search(value);
    setResults(result);
    setLoading(false);
  };

  const handleChange = (e: any) => {
    fetchResult(e.target.value);
  };

  const debouncedChange = _debounce(handleChange, 300);

  return (
    <div className="w-full flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? value.app : "Search app..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 flex w-full">
          <Command onChange={debouncedChange} className="w-full">
            <CommandInput placeholder="Search app..." className="h-9" />
            {loading ? (
              <div className="p-4 text-sm flex justify-center items-center">
                Loading...
              </div>
            ) : (
              <>
                <CommandGroup className="overflow-scroll h-44">
                  {results.map((appData) => (
                    <CommandItem
                      key={appData.app}
                      value={appData.app}
                      onSelect={handleSelect}
                    >
                      {appData.app}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      <p className="font-medium text-xs pt-2 text-gray-400">
        Try Full name - "Facebook"
      </p>
      {!_isEmpty(value) && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-8 pt-4">
          <Card className="grid-cols-2 col-span-8 md:col-span-4">
            <CardHeader>
              <CardTitle>App Sentiment</CardTitle>
              {sentimentData.reduce(
                (result, data: { value: number }) => result + data.value,
                0
              ) === 0 && (
                <CardContent className="p-0 text-sm">
                  No Sentiment Data for the app
                </CardContent>
              )}
              <CardContent className="pl-2">
                <SentimentChart data={sentimentData} />
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AppViewTab;
