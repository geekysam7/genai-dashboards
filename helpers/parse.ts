// parse app data
import _groupBy from "lodash/groupBy";
import _keyBy from "lodash/keyBy";
import _set from "lodash/set";

import {
  IDasbhboard,
  TAppInfo,
  TAppReviewInfo,
  TSentiments,
} from "@/types/app";
import { Dictionary } from "@/types/general";
import { APP_DETAIL_HEADERS, APP_REVIEWS_HEADERS } from "@/constants/app";
import { SENTIMENT_INIT_COUNT } from "@/constants/app";

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

const getParsedAppData = (
  appData: TAppInfo[],
  reviewsData: TAppReviewInfo[]
) => {
  const appDataByName = _keyBy(appData, APP_DETAIL_HEADERS.APP); // uniq values will be overrided
  const appReviewsByName = _groupBy(reviewsData, APP_REVIEWS_HEADERS.APP);
  const availableApps = Object.keys(appDataByName);

  const appDataWithReviews = getUpdatedAppDataWithReviews({
    appDataByName,
    appReviewsByName,
    availableApps,
  });
  const globalSentiment = getSentiment(reviewsData);
  const allValues = Object.values(appDataWithReviews);

  return {
    values: allValues,
    total: allValues.length,
    globalSentiment,
  };
};

export { getParsedAppData };
