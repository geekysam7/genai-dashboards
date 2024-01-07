import _keys from "lodash/keys";
import _reduce from "lodash/reduce";

import { SENTIMENT_VS_COLOR } from "@/constants/app";
import { FALLBACK } from "@/constants/general";
import { TSentimentCount } from "@/types/app";

const getSentimentName = (name: string) => {
  if (name === FALLBACK) return "No Sentiment";
  return name.slice(0, 1) + name.slice(1).toLowerCase();
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

export { getSentimentName, getSentimentData };
