const TABS = {
  OVERVIEW: "OVERVIEW",
  CUSTOMIZE: "CUSTOMIZE",
  REPORTS: "REPORTS",
  NOTIFICATIONS: "NOTIFICATIONS",
} as const;

// ideally separate to create i18n wrapped strings.
const TABS_VS_VALUE_TO_DISPLAY = {
  [TABS.OVERVIEW]: "Overview",
  [TABS.CUSTOMIZE]: "Customize",
  [TABS.REPORTS]: "Reports",
  [TABS.NOTIFICATIONS]: "Notifications",
};

const TAB_VIEW_ORDER = [
  TABS.OVERVIEW,
  TABS.CUSTOMIZE,
  TABS.REPORTS,
  TABS.NOTIFICATIONS,
];

type TTabs = keyof typeof TABS;

export { TABS, TABS_VS_VALUE_TO_DISPLAY, TAB_VIEW_ORDER };

export type { TTabs };
