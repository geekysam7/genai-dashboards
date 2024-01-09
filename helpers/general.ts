import _isNil from "lodash/isNil";

const getFormattedValue = (
  value: number,
  divider: number,
  fixed: boolean = false
) => {
  const updatedValue = value / divider;
  if (fixed) {
    return updatedValue.toFixed(2).toString();
  }
  return updatedValue.toString();
};

const dataFormatter = (value: number, fixed = true) => {
  if (value > 1000000000) {
    return getFormattedValue(value, 1000000000, fixed) + "B";
  } else if (value > 1000000) {
    return getFormattedValue(value, 1000000, fixed) + "M";
  } else if (value > 1000) {
    return getFormattedValue(value, 1000, fixed) + "K";
  } else {
    return value.toString();
  }
};

const tickFormatter = (value: number) => dataFormatter(value);

const formatInstallValue = (value: string) =>
  parseInt(value.replaceAll(",", "").replace("+", ""));

const parseInstallSize = (value: string) => {
  const updatedValue = formatInstallValue(value);
  return dataFormatter(updatedValue, false);
};

const getIsValidQuery = (query: string) => {
  const parsedQuery = JSON.parse(query.replaceAll("`", "").trim());
  const isValid = !_isNil(parsedQuery?.query);
  return {
    isValid,
    query: parsedQuery,
  };
};

export {
  dataFormatter,
  parseInstallSize,
  tickFormatter,
  formatInstallValue,
  getIsValidQuery,
};
