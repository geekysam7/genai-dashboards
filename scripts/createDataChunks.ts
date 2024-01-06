// parse app data
import _groupBy from "lodash/groupBy";
import _keyBy from "lodash/keyBy";
import _set from "lodash/set";
import _values from "lodash/values";
import _map from "lodash/map";
import _keys from "lodash/keys";
import _reduce from "lodash/reduce";
import _forEach from "lodash/forEach";

import {
  IDasbhboard,
  TAppInfo,
  TAppReviewInfo,
  TSentimentCount,
  TSentiments,
} from "../types/app";
import { Dictionary } from "../types/general";
import {
  APP_DETAIL_HEADERS,
  APP_REVIEWS_HEADERS,
  SENTIMENT_TYPES,
  SENTIMENT_VS_COLOR,
  SENTIMENT_INIT_COUNT,
} from "./constants";

import { getSentimentName, formatInstallValue } from "./helpers";

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

/*
  Instead of putting all in one single reduce function, they are separated.
  Think like sentry dashboard, where you can customize a widget.
  A customized widget does not fit a single need, it will have a separate parallel API call to fill the data.
  Hence the logic is immitating the similar pattern, where the data is expected to be indexed (think elasticsearch)
  Indexed data will be way faster to calculate and fetch.

  NOTE: some categories are clubbed due to high load time
  this can easily be shifted to backend, but to immitate fetching logic on UI, and some parsing steps that may be required
  I've done it here.
*/
const createDataChunks = (
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

  const categoriesSorted = _values(categoryVsAggregation).sort(
    (a, b) => a.length - b.length
  );
  let leastTrendingCategory = "";
  let trendingCategory = "";

  if (categoriesSorted.length > 1) {
    leastTrendingCategory = categoriesSorted[0][0].category;
    trendingCategory =
      categoriesSorted[categoriesSorted.length - 1][0].category;
  }

  const categoryAggregation = _map(_keys(categoryVsAggregation), (key) => ({
    name: key,
    ...getCategoryData(categoryVsAggregation, key),
  }));

  // avg rating
  // app with no reviews
  // genre aggregation
  let trendingGenre = "";
  let mostPopularGenreCount = 0;
  let leastPopularGenreCount = Infinity;
  let leastTrendingGenre = "";

  // most & least
  let mostInstalled = {};
  let mostInstalledCount = 0;
  let leastInstalled = {};
  let leastInstalledCount = Infinity;
  let mostReviewed = {};
  let mostReviewedCount = 0;
  let leastReviewed = {};
  let leastReviewedCount = Infinity;
  let bestAppSentiment = {};
  let bestAppSentimentCount = 0;
  let worstAppSentiment = {};
  let worstAppSentimentCount = Infinity;

  const {
    allRatings,
    appsWithNoRating,
    totalAcceptedRatings,
    totalAppWithNoReviews,
    genreAggregation,
  } = _reduce(
    appDataWithReviews,
    (result, appData) => {
      const { installs, reviews, appSentiment, rating, genres } = appData;

      // rating avg calculation
      if (rating === 0) {
        result = {
          ...result,
          appsWithNoRating: result.appsWithNoRating + 1,
        };
      } else {
        result = {
          ...result,
          allRatings: result.allRatings + rating,
          totalAcceptedRatings: result.totalAcceptedRatings + 1,
        };
      }

      // app with no reviews
      if (reviews === 0) {
        result.totalAppWithNoReviews += 1;
      }

      // genre calculation
      genres.forEach((genre: string) => {
        const count = result.genreAggregation[genre]
          ? result.genreAggregation[genre].count + 1
          : 1;
        if (count > mostPopularGenreCount) {
          mostPopularGenreCount = count;
          trendingGenre = genre;
        } else if (count < leastPopularGenreCount) {
          leastPopularGenreCount = count;
          leastTrendingGenre = genre;
        }
        result.genreAggregation[genre] = {
          ...(result.genreAggregation[genre]
            ? {
                ...result.genreAggregation[genre],
                count,
              }
            : {
                count,
                genre,
              }),
        };
      });

      const parsedInstalls = formatInstallValue(installs);
      if (parsedInstalls > mostInstalledCount) {
        mostReviewedCount = parsedInstalls;
        mostInstalled = appData;
      } else if (leastInstalledCount < parsedInstalls) {
        leastInstalledCount = parsedInstalls;
        leastInstalled = appData;
      }

      if (reviews > mostReviewedCount) {
        mostReviewedCount = reviews;
        mostReviewed = appData;
      } else if (reviews < leastReviewedCount) {
        leastReviewedCount = reviews;
        leastReviewed = appData;
      }

      if (appSentiment[SENTIMENT_TYPES.POSITIVE] > bestAppSentimentCount) {
        bestAppSentimentCount = appSentiment[SENTIMENT_TYPES.POSITIVE];
        bestAppSentiment = appData;
      } else if (
        appSentiment[SENTIMENT_TYPES.NEGATIVE] < worstAppSentimentCount
      ) {
        worstAppSentimentCount = appSentiment[SENTIMENT_TYPES.NEGATIVE];
        worstAppSentiment = appData;
      }
      return result;
    },
    {
      allRatings: 0,
      appsWithNoRating: 0,
      totalAcceptedRatings: 0,
      totalAppWithNoReviews: 0,
      genreAggregation: {} as any,
    }
  );

  // content category
  const contentCategoryVsData = _groupBy(
    appDataWithReviews,
    `${APP_DETAIL_HEADERS.CONTENT_RATING}.category`
  );

  let popularContentRating = "";
  const sortedCategories = _values(contentCategoryVsData).sort(
    (a, b) => a.length - b.length
  );
  if (sortedCategories.length) {
    popularContentRating =
      sortedCategories[sortedCategories.length - 1][0].contentRating.category;
  }

  return {
    values: appDataWithReviews,
    total: appDataWithReviews.length,
    globalSentiment,
    sentimentData: getSentimentData(globalSentiment),
    avgRating: parseInt((allRatings / (totalAcceptedRatings || 1)).toFixed(1)),
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
  };
};

export { createDataChunks };
