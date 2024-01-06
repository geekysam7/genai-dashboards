import { FALLBACK } from "@/constants/general";

const SENTIMENT_TYPES = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NEUTRAL: "NEUTRAL",
};

const SENTIMENTS = [
  SENTIMENT_TYPES.POSITIVE,
  SENTIMENT_TYPES.NEGATIVE,
  SENTIMENT_TYPES.NEUTRAL,
] as const;

const ACCEPTED_SENTIMENTS = new Set(SENTIMENTS);

const APP_FREE_TYPE = "FREE";
const APP_TYPES = [APP_FREE_TYPE, "PAID"] as const;
const ACCEPTED_APP_TYPES = new Set(APP_TYPES);

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

const SENTIMENT_INIT_COUNT = {
  [SENTIMENT_TYPES.POSITIVE]: 0,
  [SENTIMENT_TYPES.NEGATIVE]: 0,
  [SENTIMENT_TYPES.NEUTRAL]: 0,
  [FALLBACK]: 0,
};

export { SENTIMENT_INIT_COUNT };

export {
  SENTIMENTS,
  ACCEPTED_SENTIMENTS,
  APP_TYPES,
  ACCEPTED_APP_TYPES,
  APP_FREE_TYPE,
  APP_DETAIL_HEADERS,
  APP_REVIEWS_HEADERS,
  SENTIMENT_TYPES,
};
