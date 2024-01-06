import XLSX from "xlsx";
import _trim from "lodash/trim";
import _isNaN from "lodash/isNaN";
import _isEmpty from "lodash/isEmpty";
import _isDate from "lodash/isDate";
import _toNumber from "lodash/toNumber";
import _uniq from "lodash/uniq";
import fs from "fs";

import { TAppInfo, TAppReviewInfo } from "../types/app";
import { ITEM, VALUE_PARSER } from "../types/general";
import { createDataChunks } from "./createDataChunks";
import {
  ACCEPTED_SENTIMENTS,
  APP_FREE_TYPE,
  ACCEPTED_APP_TYPES,
  FALLBACK,
} from "./constants";

const APP_DETAIL_HEADERS = {
  APP: "app",
  CATEGORY: "category",
  RATING: "rating",
  REVIEWS: "reviews",
  SIZE: "size",
  INSTALLS: "installs",
  TYPE: "type",
  PRICE: "price",
  GENRES: "genres",
  LAST_UPDATED: "lastUpdated",
  CURRENT_VER: "currentVersion",
  ANDROID_VER: "androidVersion",
  CONTENT_RATING: "contentRating",
} as const;

const APP_REVIEWS_HEADERS = {
  APP: "app",
  TRANSLATED_REVIEW: "translatedReview",
  SENTIMENT: "sentiment",
} as const;

const numberParserWithFallback = (value: string) => {
  if (!_isNaN(_toNumber(value))) {
    return parseFloat(value);
  }
  // fallback should not be taken as parameter, we need consistent type system.
  return 0;
};

const getParsedAppData = (
  value: string | number,
  header: keyof typeof APP_DETAIL_HEADERS
) => {
  const trimmedValue = _trim(String(value));
  switch (APP_DETAIL_HEADERS[header]) {
    case APP_DETAIL_HEADERS.APP:
    case APP_DETAIL_HEADERS.SIZE:
    case APP_DETAIL_HEADERS.INSTALLS:
    case APP_DETAIL_HEADERS.ANDROID_VER:
      return trimmedValue;
    case APP_DETAIL_HEADERS.CATEGORY: {
      if (!_isEmpty(trimmedValue)) return trimmedValue.toUpperCase();
      return FALLBACK;
    }
    case APP_DETAIL_HEADERS.RATING:
    case APP_DETAIL_HEADERS.REVIEWS:
      return numberParserWithFallback(trimmedValue);
    case APP_DETAIL_HEADERS.TYPE: {
      // 0, Free, Paid, NaN
      const upperCaseType = trimmedValue.toUpperCase();
      if (ACCEPTED_APP_TYPES.has(upperCaseType as any)) return upperCaseType;
      return APP_FREE_TYPE;
    }
    case APP_DETAIL_HEADERS.PRICE: {
      // ideally this should be converted to local currency.
      if (trimmedValue === "0") return "$0";
      return trimmedValue;
    }
    case APP_DETAIL_HEADERS.CONTENT_RATING: {
      // adults only 18+, mature 17+, ..., Teen.
      // this should be handled in better way if there can be more assertions
      const [category, assertion, lowerLimit] = trimmedValue.split(" ");
      return {
        category,
        assertion: assertion || FALLBACK,
        lowerLimit: lowerLimit || FALLBACK,
      };
    }
    case APP_DETAIL_HEADERS.GENRES: {
      return trimmedValue.split(";");
    }
    case APP_DETAIL_HEADERS.LAST_UPDATED: {
      // ideally check for valid date using moment/third party lib
      return new Date(trimmedValue).getTime();
    }
    // expecting F2i, MONEY and so values to be accurate as it depends on developer to define?
    case APP_DETAIL_HEADERS.CURRENT_VER: {
      const currentVer = trimmedValue.toUpperCase();
      if (_isEmpty(currentVer) || currentVer === "NAN") return FALLBACK;
      return trimmedValue;
    }
    default:
      return FALLBACK;
  }
};

const getParsedAppReviews = (
  value: string | number,
  header: keyof typeof APP_REVIEWS_HEADERS
) => {
  const trimmedValue = _trim(String(value));
  switch (APP_REVIEWS_HEADERS[header]) {
    case APP_REVIEWS_HEADERS.APP:
    case APP_REVIEWS_HEADERS.TRANSLATED_REVIEW:
      return trimmedValue;
    case APP_REVIEWS_HEADERS.SENTIMENT: {
      const sentiment = trimmedValue.toUpperCase();
      if (ACCEPTED_SENTIMENTS.has(sentiment as any)) return sentiment;
      return FALLBACK;
    }
    default:
      return FALLBACK;
  }
};

const parseWorksheet = <T, U>(
  workbook: any,
  valueParser: VALUE_PARSER = (value: any, headers: any) => value,
  definedHeaders: U
): T[] => {
  const data: T[] = [];
  const headers: ITEM<U> = {}; // { A: APP, B: RATING, ...}
  const sheet_name_list = workbook.SheetNames;
  sheet_name_list.forEach((y: any) => {
    const worksheet = workbook.Sheets[y];
    for (const z in worksheet) {
      const col = z.substring(0, 1);
      const row = parseInt(z.substring(1));
      const value = worksheet[z].v as string;

      if (row == 1 && value) {
        /*
        for headers
        ideally we can dynamically parse headers and update them, but to add TS support we're expecting them to be predefined
        format:
        {
            A: APP,
            ...
            E: CONTENT_RATING,
        }
      */
        headers[col] = value.toUpperCase().split(" ").join("_") as keyof U;
        continue;
      }
      data[row] = {
        ...(data[row] || {}),
        [definedHeaders[headers[col]] as string]: valueParser(
          value,
          headers[col]
        ),
      } as T;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
  });
  return data;
};

const evaluateWorksheets = <T, U extends { [K: string]: string }>(
  readPath: string,
  writePath: string,
  definedHeaders: U,
  valueParser?: VALUE_PARSER
) => {
  try {
    const fileBuffer = XLSX.readFile(readPath, {
      cellDates: true,
    });
    const jsonData = parseWorksheet<T, U>(
      fileBuffer,
      valueParser,
      definedHeaders
    );
    fs.writeFileSync(writePath, JSON.stringify(jsonData), "utf8");
    return jsonData;
  } catch (error) {
    console.log("Error - ", error);
    return [];
  }
};

// passing types here is not needed unless some value is returned from the function.
// passing still for readability.
const appData = evaluateWorksheets<TAppInfo, typeof APP_DETAIL_HEADERS>(
  "../resource/googleplaystore.xlsx",
  "../public/appData.json",
  APP_DETAIL_HEADERS,
  getParsedAppData
);
const reviewsData = evaluateWorksheets<
  TAppReviewInfo,
  typeof APP_REVIEWS_HEADERS
>(
  "../resource/googleplaystore_user_reviews.xlsx",
  "../public/appReviews.json",
  APP_REVIEWS_HEADERS,
  getParsedAppReviews
);

const writeChunks = (path: string, data: any) => {
  fs.writeFileSync(path, JSON.stringify(data), "utf8");
};

const {
  values,
  total,
  globalSentiment,
  sentimentData,
  avgRating,
  appsWithNoRating,
  mostInstalled,
  leastInstalled,
  trendingGenre,
  leastTrendingGenre,
  genreAggregation,
  trendingCategory,
  leastTrendingCategory,
  mostReviewed,
  leastReviewed,
  bestAppSentiment,
  worstAppSentiment,
  popularContentRating,
  totalAppWithNoReviews,
  categoryAggregation,
  contentCategoryVsData,
} = createDataChunks(appData, reviewsData);

// parsed data with reviews and app data
writeChunks("../public/values.json", {
  values,
  total,
});

// individual app data stats
writeChunks("../public/individualAppStats.json", {
  mostReviewed,
  leastReviewed,
  bestAppSentiment,
  worstAppSentiment,
  mostInstalled,
  leastInstalled,
});

// aggregations
writeChunks("../public/aggregations.json", {
  sentimentData,
  categoryAggregation,
  contentCategoryVsData,
  genreAggregation,
});

// small data sets
writeChunks("../public/quickStats.json", {
  avgRating,
  appsWithNoRating,
  trendingGenre,
  leastTrendingGenre,
  popularContentRating,
  totalAppWithNoReviews,
  globalSentiment,
  trendingCategory,
  leastTrendingCategory,
});
