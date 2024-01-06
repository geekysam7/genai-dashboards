import { Suspense } from "react";

import MainNav from "@/components/MainNav";
import UserNav from "@/components/UserNav";
import { TDasboardDisplay } from "@/types/app";

import DashboardWrapper from "./components/DashboardWrapper";

const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3002"
  : "https://segwise-assignment-sameer.vercel.app";

const getAppData = async (path: string) => {
  try {
    // fetch automatically caches the data.
    const appData = await fetch(`${server}/${path}`);
    const appDataParsed = await appData.json();
    return appDataParsed;
  } catch (error) {
    return {};
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appData, individualAppStats, quickStats, aggregations] =
    await Promise.all([
      getAppData("values.json"),
      getAppData("individualAppStats.json"),
      getAppData("quickStats.json"),
      getAppData("aggregations.json"),
    ]);

  const parsedData = {
    ...appData,
    ...individualAppStats,
    ...quickStats,
    ...aggregations,
  } as TDasboardDisplay;

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
