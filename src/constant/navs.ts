import {
  IconApps,
  IconDatabase,
  IconDeviceDesktop,
  IconExclamationCircle,
  IconGavel,
  IconLanguage,
  IconLayout,
  IconShieldHalf,
  IconShieldLock,
} from "@tabler/icons-react";

export const NAVS = [
  {
    labelKey: "navs.dashboard",
    path: "/dashboard",
    icon: IconLayout,
  },
  {
    labelKey: "navs.administration",
    path: "/administration",
    icon: IconDatabase,
  },
  {
    labelKey: "navs.services",
    path: "/services",
    icon: IconApps,
  },
];

export const SETTINGS_NAVS = [
  {
    groupLabelKey: "settings_navs_group.main",
    list: [
      {
        icon: IconDeviceDesktop,
        labelKey: "settings_navs.display",
        path: "/settings/display",
      },
      {
        icon: IconLanguage,
        labelKey: "settings_navs.regional",
        path: "/settings/regional",
      },
      {
        icon: IconShieldHalf,
        labelKey: "settings_navs.permissions",
        path: "/settings/permissions",
      },
    ],
  },
  {
    groupLabelKey: "settings_navs_group.others",
    list: [
      {
        icon: IconExclamationCircle,
        labelKey: "settings_navs.report_problem",
        path: "/settings/report-problem",
      },
      {
        icon: IconGavel,
        labelKey: "settings_navs.terms_of_service",
        path: "/settings/terms-of-service",
      },
      {
        icon: IconShieldLock,
        labelKey: "settings_navs.privacy_policy",
        path: "/settings/privacy-policy",
      },
    ],
  },
];
