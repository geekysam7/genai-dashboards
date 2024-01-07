import { useContext } from "react";
import {
  GlobeIcon,
  PersonIcon,
  EyeNoneIcon,
  Pencil2Icon,
  ChatBubbleIcon,
  BarChartIcon,
} from "@radix-ui/react-icons";
import _isEmpty from "lodash/isEmpty";

import Card, { CardContent, CardHeader, CardTitle } from "@/components/Card";
import Overview from "@/components/charts/OverviewChart";
import { TabsContent } from "@/components/ui/tabs";
import CategoryAggregationChart from "@/components/charts/CategoryChart";
import SentimentChart from "@/components/charts/SentimentChart";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/Table";

import { TABS } from "../constants/general";
import { DashboardContext } from "./DashboardWrapper";

const OverviewTab = () => {
  const {
    categoryAggregation,
    total,
    totalAppWithNoReviews,
    sentimentData,
    avgRating,
    appsWithNoRating,
    trendingGenre,
    leastTrendingGenre,
    genreAggregation,
    bestAppSentiment,
    worstAppSentiment,
    mostInstalled,
    leastInstalled,
    mostReviewed,
    leastReviewed,
    trendingCategory,
    leastTrendingCategory,
    popularContentRating,
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
            {genreAggregation?.[trendingGenre]?.count && (
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
            <EyeNoneIcon />
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
            <Pencil2Icon />
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
            <CardTitle>Genre Aggregation</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={genreAggregation} />
          </CardContent>
        </Card>
        <Card className="grid-cols-2 col-span-7 lg:col-span-3">
          <CardHeader>
            <CardTitle>Global App Sentiment</CardTitle>
            <CardContent className="p-0 text-sm">
              Most Results - {sentimentData?.overallSentiment.name}
            </CardContent>
            <CardContent className="pl-2">
              <SentimentChart data={sentimentData?.data} />
            </CardContent>
          </CardHeader>
        </Card>
        <Card className="col-span-7 grid-cols-2">
          <CardHeader>
            <CardTitle>Category Aggregation</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <CategoryAggregationChart data={categoryAggregation} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="grid-cols-4 col-span-7 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most & Least Popular Data
            </CardTitle>
            <BarChartIcon />
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                A list of most and least popular data available from all apps.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Type</TableHead>
                  <TableHead>Most Popular</TableHead>
                  <TableHead className="text-right">Least Popular</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">App Sentiment</TableCell>
                  <TableCell>{bestAppSentiment?.app}</TableCell>
                  <TableCell className="text-right">
                    {worstAppSentiment?.app}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Installations</TableCell>
                  <TableCell>{mostInstalled?.app}</TableCell>
                  <TableCell className="text-right">
                    {leastInstalled?.app}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reviewed</TableCell>
                  <TableCell>{mostReviewed?.app}</TableCell>
                  <TableCell className="text-right">
                    {leastReviewed?.app}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Trending Category
                  </TableCell>
                  <TableCell>{trendingCategory}</TableCell>
                  <TableCell className="text-right">
                    {leastTrendingCategory}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="grid-cols-4 col-span-7 lg:grid-cols-none lg:col-span-1 flex flex-col">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Popular Content Category
              </CardTitle>
              <ChatBubbleIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{popularContentRating}</div>
              {popularContentRating && (
                <p className="text-xs text-muted-foreground">
                  is the content category with most apps
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Least Trending Genre
              </CardTitle>
              <PersonIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leastTrendingGenre}</div>
              {genreAggregation?.[leastTrendingGenre]?.count && (
                <p className="text-xs text-muted-foreground">
                  there are only a total of{" "}
                  {genreAggregation[leastTrendingGenre].count} apps of this
                  genre!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
