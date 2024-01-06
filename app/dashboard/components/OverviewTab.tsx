import { useContext } from "react";
import { GlobeIcon, PersonIcon } from "@radix-ui/react-icons";

import Card, { CardContent, CardHeader, CardTitle } from "@/components/Card";
import Overview from "@/components/Overview";
import { TabsContent } from "@/components/ui/tabs";
import CategoryAggregationChart from "@/components/charts/BarChart";

import { TABS } from "../constants/general";
import { DashboardContext } from "./DashboardWrapper";
import SentimentChart from "@/components/charts/SentimentChart";

const OverviewTab = () => {
  const {
    categoryAggregation,
    total,
    totalAppWithNoReviews,
    sentimentData,
    avgRating,
    appsWithNoRating,
    trendingGenre,
    genreAggregation,
  } = useContext(DashboardContext);
  return (
    <TabsContent value={TABS.OVERVIEW} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Apps</CardTitle>
            <GlobeIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              +9.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Popular Genre
            </CardTitle>
            <PersonIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trendingGenre}</div>
            {genreAggregation[trendingGenre]?.count && (
              <p className="text-xs text-muted-foreground">
                there are a total of {genreAggregation[trendingGenre]?.count}{" "}
                apps of this genre!
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Apps with No Reviews
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppWithNoReviews}</div>
            <p className="text-xs text-muted-foreground">
              -10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
            {appsWithNoRating && (
              <p className="text-xs text-muted-foreground">
                total {appsWithNoRating} apps have no ratings yet!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="grid-cols-2 col-span-7 lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={genreAggregation} />
          </CardContent>
        </Card>
        <Card className="grid-cols-2 col-span-7 lg:col-span-3">
          <CardHeader>
            <CardTitle>Global App Sentiment</CardTitle>
            <CardContent className="p-0 text-sm">
              Most Results - {sentimentData.overallSentiment.name}
            </CardContent>
            <CardContent className="pl-2">
              <SentimentChart data={sentimentData.data} />
            </CardContent>
          </CardHeader>
        </Card>
        <Card className="col-span-7 grid-cols-2">
          <CardHeader>
            <CardTitle>Category vs Reviews</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <CategoryAggregationChart data={categoryAggregation} />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
