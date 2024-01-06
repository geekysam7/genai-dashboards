"use client";
import { useState } from "react";
import Button from "@/components/Button";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangePicker from "@/components/DateRangePicker";
import Search from "@/components/Search";
import OverviewTab from "./components/OverviewTab";
import {
  TABS,
  TABS_VS_VALUE_TO_DISPLAY,
  TAB_VIEW_ORDER,
  TTabs,
} from "./constants/general";

const TAB_TYPE_VS_TAB = {
  [TABS.OVERVIEW]: OverviewTab,
  [TABS.CUSTOMIZE]: OverviewTab,
  [TABS.REPORTS]: OverviewTab,
  [TABS.NOTIFICATIONS]: OverviewTab,
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<TTabs>(TABS.OVERVIEW);

  // Check radix ui source, why do they need string? This should be T extends string
  const handleValueChange = (value: string) => {
    setActiveTab(value as TTabs);
  };

  const TabToRender = TAB_TYPE_VS_TAB[activeTab];

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <DateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <Tabs
        defaultValue={TABS.OVERVIEW}
        className="space-y-4"
        onValueChange={handleValueChange}
      >
        <TabsList>
          {TAB_VIEW_ORDER.map((tab) => (
            <TabsTrigger
              value={TABS[tab]}
              key={tab}
              children={TABS_VS_VALUE_TO_DISPLAY[tab]}
            />
          ))}
        </TabsList>
        <Search />
        <TabToRender />
      </Tabs>
    </>
  );
};

export default DashboardPage;
