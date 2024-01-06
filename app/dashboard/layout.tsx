import { Suspense } from "react";

import MainNav from "@/components/MainNav";
import UserNav from "@/components/UserNav";
import DashboardWrapper from "./components/DashboardWrapper";
import { getParsedAppData } from "@/helpers/parse";

const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3001"
  : "https://segwise-assignment-sameer.vercel.app";

const getAppData = async () => {
  try {
    // fetch automatically caches the data.
    const appData = await fetch(`${server}/appData.json`);
    const appDataParsed = appData.json();
    return appDataParsed;
  } catch (error) {
    return [];
  }
};

const getAppReviewsData = async () => {
  try {
    const appData = await fetch(`${server}/appReviews.json`);
    const appDataParsed = appData.json();
    return appDataParsed;
  } catch (error) {
    return [];
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appData, appReviewsData] = await Promise.all([
    getAppData(),
    getAppReviewsData(),
  ]);
  const parsedData = getParsedAppData(appData, appReviewsData);
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardWrapper data={parsedData}>{children}</DashboardWrapper>
      </Suspense>
    </div>
  );
}
