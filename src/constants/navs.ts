import {
  IconCategory2,
  IconChartPie,
  IconDeviceDesktop,
  IconFolderOpen,
  IconFolders,
  IconLanguage,
  IconMapPinSearch,
  IconServerCog,
  IconShieldHalf,
} from "@tabler/icons-react";

export const NAVS = [
  {
    labelKey: "navs.workspace",
    path: "/workspace",
    icon: IconFolders,
  },
  {
    labelKey: "navs.active_workspace",
    path: "/active-workspace",
    icon: IconFolderOpen,
    iconProps: {
      // boxSize: ["", null, "22px"],
    },
  },
  {
    labelKey: "navs.field_data",
    path: "/field-data",
    icon: IconMapPinSearch,
  },
  {
    labelKey: "navs.dashboard",
    path: "/dashboard",
    icon: IconChartPie,
  },
  {
    labelKey: "navs.master_data",
    path: "/master-data",
    icon: IconServerCog,
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
  // {
  //   groupLabelKey: "settings_navs_group.others",
  //   list: [
  //     {
  //       icon: IconExclamationCircle,
  //       labelKey: "settings_navs.report_problem",
  //       path: "/settings/report-problem",
  //     },
  //     {
  //       icon: IconGavel,
  //       labelKey: "settings_navs.terms_of_service",
  //       path: "/settings/terms-of-service",
  //     },
  //     {
  //       icon: IconShieldLock,
  //       labelKey: "settings_navs.privacy_policy",
  //       path: "/settings/privacy-policy",
  //     },
  //   ],
  // },
];

export const MASTER_DATA_NAVS = [
  {
    groupLabelKey: "master_data_navs_group.workspace",
    list: [
      {
        icon: IconCategory2,
        labelKey: "master_data_navs.workspace_categories",
        path: "/master-data/workspace-categories",
      },
    ],
  },
];
