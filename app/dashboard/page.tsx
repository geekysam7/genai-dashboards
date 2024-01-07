"use client";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./components/OverviewTab";
import ReportsTab from "./components/ReportsTab";
import SearchTab from "./components/SearchTab";
import AppViewTab from "./components/AppViewTab";

import {
  TABS,
  TABS_VS_VALUE_TO_DISPLAY,
  TAB_VIEW_ORDER,
  TTabs,
} from "./constants/general";

const TAB_TYPE_VS_TAB = {
  [TABS.OVERVIEW]: OverviewTab,
  [TABS.APP_VIEW]: AppViewTab,
  [TABS.REPORTS]: ReportsTab,
  [TABS.SEARCH]: SearchTab,
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
      </div>
      <Tabs
        defaultValue={TABS.OVERVIEW}
        className="space-y-4 w-full"
        onValueChange={handleValueChange}
      >
        <TabsList className="w-full lg:w-auto overflow-x-scroll flex justify-start">
          {TAB_VIEW_ORDER.map((tab) => (
            <TabsTrigger
              value={TABS[tab]}
              key={tab}
              children={TABS_VS_VALUE_TO_DISPLAY[tab]}
            />
          ))}
        </TabsList>
        <TabToRender />
      </Tabs>
    </>
  );
};

export default DashboardPage;
