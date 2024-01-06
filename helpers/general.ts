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

const parseInstallSize = (value: string) => {
  const updatedValue = value.replaceAll(",", "").replace("+", "");
  return dataFormatter(parseInt(updatedValue), false);
};

export { dataFormatter, parseInstallSize, tickFormatter };
