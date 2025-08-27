import DisplaySettingsPage from "@/pages/_settings/DisplaySettingsPage";
import PermissionsSettingsPage from "@/pages/_settings/PermissionsSettingsPage";
import PrivacyPolictPage from "@/pages/_settings/PrivacyPolictPage";
import RegionalSettingsPage from "@/pages/_settings/RegionalSettingsPage";
import ReportProblemPage from "@/pages/_settings/ReportProblemPage";
import TermsOfServicePage from "@/pages/_settings/TermsOfServicePage";
import ActiveWorkspacePage from "@/pages/admin/ActiveWorkspacePage";
import DashboardPage from "@/pages/admin/DashboardPage";
import MasterDataPage from "@/pages/admin/MasterDataPage";
import ProfilePage from "@/pages/admin/ProfilePage";
import WorkspacePage from "@/pages/admin/WorkspacePage";
import RootPage from "@/pages/RootPage";
import SettingsPage from "@/pages/SettingsPage";
import { Interface__PrivateRoute, Interface__Route } from "./interfaces";
import MasterDataWorkspaceCategoriesPage from "@/pages/admin/MasterDataWorkspaceCategoriesPage";
import FieldDataPage from "@/pages/admin/FieldDataPage";

export const ROUTES: Interface__Route[] = [
  {
    path: "/",
    activePath: "/",
    element: <RootPage />,
  },
];

export const PRIVATE_ROUTES: Interface__PrivateRoute[] = [
  {
    path: "/workspace",
    activePath: "/workspace",
    titleKey: "navs.workspace",
    element: <WorkspacePage />,
  },
  {
    path: "/active-workspace",
    activePath: "/active-workspace",
    titleKey: "navs.active_workspace",
    element: <ActiveWorkspacePage />,
  },
  {
    path: "/dashboard",
    activePath: "/dashboard",
    titleKey: "navs.dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/field-data",
    activePath: "/field-data",
    titleKey: "navs.field_data",
    element: <FieldDataPage />,
  },

  // Profile
  {
    path: "/profile",
    activePath: "/profile",
    titleKey: "navs.profile",
    element: <ProfilePage />,
  },
];

// Master Settings
export const PRIVATE_ROUTES_MASTER_DATA: Interface__PrivateRoute[] = [
  {
    path: "/master-data",
    activePath: "/master-data",
    titleKey: "navs.master_data",
    element: <MasterDataPage />,
  },
  {
    path: "/master-data/workspace-categories",
    activePath: "/master-data",
    backPath: "/master-data",
    titleKey: "master_data_navs.workspace_categories",
    element: <MasterDataWorkspaceCategoriesPage />,
  },
];

// Settings
export const PRIVATE_ROUTES_SETTINGS: Interface__PrivateRoute[] = [
  {
    path: "/settings",
    activePath: "/settings",
    titleKey: "navs.settings",
    element: <SettingsPage />,
  },
  {
    path: "/settings/display",
    activePath: "/settings",
    titleKey: "settings_navs.display",
    backPath: "/settings",
    element: <DisplaySettingsPage />,
  },
  {
    path: "/settings/regional",
    activePath: "/settings",
    titleKey: "settings_navs.regional",
    backPath: "/settings",
    element: <RegionalSettingsPage />,
  },
  {
    path: "/settings/permissions",
    activePath: "/settings",
    titleKey: "settings_navs.permissions",
    backPath: "/settings",
    element: <PermissionsSettingsPage />,
  },
  {
    path: "/settings/report-problem",
    activePath: "/settings",
    titleKey: "settings_navs.report_problem",
    backPath: "/settings",
    element: <ReportProblemPage />,
  },
  {
    path: "/settings/terms-of-service",
    activePath: "/settings",
    titleKey: "settings_navs.terms_of_service",
    backPath: "/settings",
    element: <TermsOfServicePage />,
  },
  {
    path: "/settings/privacy-policy",
    activePath: "/settings",
    titleKey: "settings_navs.privacy_policy",
    backPath: "/settings",
    element: <PrivacyPolictPage />,
  },
];
