"use client";
import { createContext } from "react";

import { TDasboardDisplay } from "@/types/app";

export const DashboardContext = createContext<TDasboardDisplay>({
  values: [],
  globalSentiment: {},
  total: 0,
  avgRating: 0,
  appsWithNoRating: 0,
  mostInstalled: {},
  leastInstalled: {},
  trendingGenre: "",
  leastTrendingGenre: "",
  trendingCategory: "",
  leastTrendingCategory: "",
  mostReviewed: {},
  leastReviewed: {},
  bestAppSentiment: {},
  worstAppSentiment: {},
  popularContentRating: "",
  totalAppWithNoReviews: 0,
  categoryAggregation: [],
  sentimentData: {
    data: [],
    overallSentiment: {
      name: "",
      value: 0,
      fill: "",
    },
  },
  genreAggregation: {},
});

const DashboardWrapper = ({
  data,
  children,
}: {
  data: TDasboardDisplay;
  children: React.ReactNode;
}) => {
  return (
    <DashboardContext.Provider value={data}>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </DashboardContext.Provider>
  );
};

export default DashboardWrapper;
