// parse app data
import _groupBy from "lodash/groupBy";
import _keyBy from "lodash/keyBy";
import _set from "lodash/set";
import _values from "lodash/values";
import _map from "lodash/map";
import _keys from "lodash/keys";
import _reduce from "lodash/reduce";

import {
  IDasbhboard,
  TAppInfo,
  TAppReviewInfo,
  TSentimentCount,
  TSentiments,
} from "@/types/app";
import { Dictionary } from "@/types/general";
import {
  APP_DETAIL_HEADERS,
  APP_REVIEWS_HEADERS,
  SENTIMENT_VS_COLOR,
} from "@/constants/app";
import { SENTIMENT_INIT_COUNT } from "@/constants/app";
import { getSentimentName } from "./app";

const getSentiment = (
  sentimentData: {
    [K: string]: any;
    sentiment: TSentiments;
  }[]
): {
  [K in TSentiments]: number;
} => {
  return sentimentData.reduce(
    (result, { sentiment }) => {
      result[sentiment]++;
      return result;
    },
    { ...SENTIMENT_INIT_COUNT }
  );
};

const getSentimentData = (data: TSentimentCount) => {
  const allData = _reduce(
    _keys(data),
    // @ts-ignore
    (result, key) => {
      return [
        ...result,
        {
          name: getSentimentName(key),
          value: data[key],
          fill: SENTIMENT_VS_COLOR[key],
        },
      ];
    },
    []
  );

  return {
    data: allData,
    overallSentiment: allData.sort(
      (a: { value: number }, b: { value: number }) => b.value - a.value
    )[0],
  };
};

const getUpdatedAppDataWithReviews = ({
  appDataByName,
  availableApps,
  appReviewsByName,
}: {
  availableApps: string[];
  appDataByName: Dictionary<TAppInfo>;
  appReviewsByName: Dictionary<TAppReviewInfo[]>;
}) => {
  return availableApps.reduce<IDasbhboard[]>((result, app: string) => {
    const translatedReviews = appReviewsByName[app]
      ? appReviewsByName[app].map(({ translatedReview, sentiment }) => ({
          review: translatedReview,
          sentiment,
        }))
      : [];
    result.push({
      ...appDataByName[app],
      translatedReviews,
      appSentiment: getSentiment(translatedReviews),
    });
    return result;
  }, []);
};

const getCategoryData = (
  categoryVsAggregation: Dictionary<IDasbhboard[]>,
  category: string
) => {
  let mostInstalled = {} as IDasbhboard;
  let mostInstalledNum: number = 0;
  const aggregatedReviews = _reduce(
    categoryVsAggregation[category],
    (result, appData) => {
      const { reviews, installs } = appData;
      const num = parseInt(installs.replaceAll(",", ""));
      if (num > mostInstalledNum) {
        mostInstalledNum = num;
        mostInstalled = appData;
      }
      result += reviews;
      return result;
    },
    0
  );

  return {
    reviews: aggregatedReviews,
    mostInstalled,
    installs: mostInstalledNum,
  };
};

const getParsedAppData = (
  appData: TAppInfo[],
  reviewsData: TAppReviewInfo[]
) => {
  const appDataByName = _keyBy(appData, APP_DETAIL_HEADERS.APP); // uniq values will be overrided
  const appReviewsByName = _groupBy(reviewsData, APP_REVIEWS_HEADERS.APP);
  const availableApps = Object.keys(appDataByName);

  const appVsDataWithReviews = getUpdatedAppDataWithReviews({
    appDataByName,
    appReviewsByName,
    availableApps,
  });
  const globalSentiment = getSentiment(reviewsData);

  const appDataWithReviews = _values(appVsDataWithReviews);

  // category
  const categoryVsAggregation = _groupBy(
    appDataWithReviews,
    APP_DETAIL_HEADERS.CATEGORY
  );

  const categoryAggregation = _map(_keys(categoryVsAggregation), (key) => ({
    name: key,
    ...getCategoryData(categoryVsAggregation, key),
  }));

  // genre

  // app with no reviews
  const totalAppWithNoReviews = _reduce(
    appDataWithReviews,
    (result, { reviews }) => {
      if (reviews === 0) {
        result += 1;
      }
      return result;
    },
    0
  );

  return {
    values: appDataWithReviews,
    total: appDataWithReviews.length,
    globalSentiment,
    sentimentData: getSentimentData(globalSentiment),
    avgRating: 0,
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
    totalAppWithNoReviews,
    categoryAggregation,
  };
};

export { getParsedAppData };
