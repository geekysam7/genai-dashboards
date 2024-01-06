import { SENTIMENTS, APP_TYPES } from "@/constants/app";
import { TFallback } from "./general";

// SENTIMENT TYPES
type TSentiments = (typeof SENTIMENTS)[number] | TFallback;

type TAppType = (typeof APP_TYPES)[number];

type TAppInfo = {
  app: string;
  category: string | TFallback;
  rating: number;
  reviews: number;
  size: string;
  installs: string;
  type: TAppType;
  price: number;
  genres: string[];
  lastUpdated: string;
  currentVersion: string;
  // values can be: varies with device and 4.0.3 and up, etc. keeping string for now, to aggregate it can be breaken up
  androidVersion: string;
  // can be converted to string
  contentRating: {
    category: "EVERYONE" | "MATURE" | "TEEN" | "ADULTS" | "UNRATED";
    lowerLimit: number | TFallback;
    assertion: string | TFallback;
  };
};

type TAppReviewInfo = {
  app: string;
  translatedReview: string;
  sentiment: TSentiments | TFallback;
};

type TSentimentCount = {
  [K in TSentiments]: number;
};

interface IDasbhboard extends TAppInfo {
  translatedReviews: {
    sentiment: TAppReviewInfo["sentiment"];
    review: TAppReviewInfo["translatedReview"];
  }[];
  appSentiment: TSentimentCount;
}

type TCategoryAggregation = {
  mostInstalled: IDasbhboard;
  reviews: number;
  name: string;
  installs: number;
};

type TSentiment = { name: string; value: number; fill: string };

type TSentimentData = {
  data: TSentiment[];
  overallSentiment: TSentiment;
};

type TDasboardDisplay = {
  values: IDasbhboard[];
  globalSentiment: TSentimentCount;
  total: number;
  avgRating: number;
  appsWithNoRating: number;
  mostInstalled: IDasbhboard | {};
  leastInstalled: IDasbhboard | {};
  trendingGenre: string;
  leastTrendingGenre: string;
  trendingCategory: string;
  leastTrendingCategory: string;
  mostReviewed: IDasbhboard | {};
  leastReviewed: IDasbhboard | {};
  bestAppSentiment: IDasbhboard | {};
  worstAppSentiment: IDasbhboard | {};
  popularContentRating: string;
  totalAppWithNoReviews: number;
  categoryAggregation: TCategoryAggregation[];
  sentimentData: TSentimentData;
  genreAggregation: {
    [K: string]: {
      genre: string;
      count: number;
    };
  };
};

export type {
  TSentiments,
  TAppType,
  TAppReviewInfo,
  TAppInfo,
  IDasbhboard,
  TDasboardDisplay,
  TCategoryAggregation,
  TSentimentCount,
  TSentimentData,
};
