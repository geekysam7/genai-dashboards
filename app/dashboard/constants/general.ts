const TABS = {
  OVERVIEW: "OVERVIEW",
  APP_VIEW: "APP_VIEW",
  SEARCH: "SEARCH",
} as const;

// ideally separate to create i18n wrapped strings.
const TABS_VS_VALUE_TO_DISPLAY = {
  [TABS.OVERVIEW]: "Overview",
  [TABS.APP_VIEW]: "View App Sentiment",
  [TABS.SEARCH]: "Search",
};

const TAB_VIEW_ORDER = [TABS.OVERVIEW, TABS.APP_VIEW, TABS.SEARCH];

type TTabs = keyof typeof TABS;

export { TABS, TABS_VS_VALUE_TO_DISPLAY, TAB_VIEW_ORDER };

export type { TTabs };
