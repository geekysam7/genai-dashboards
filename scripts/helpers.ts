import { FALLBACK } from "./constants";

const formatInstallValue = (value: string) =>
  parseInt(value.replaceAll(",", "").replace("+", ""));

const getSentimentName = (name: string) => {
  if (name === FALLBACK) return "No Sentiment";
  return name.slice(0, 1) + name.slice(1).toLowerCase();
};

export { formatInstallValue, getSentimentName };
