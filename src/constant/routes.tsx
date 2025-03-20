import AdministrationPage from "@/pages/AdministrationPage";
import DashboardPage from "@/pages/DashboardPage";
import RootPage from "@/pages/RootPage";
import ServicePage from "@/pages/ServicePage";
import SettingsPage from "@/pages/SettingsPage";
import DisplaySettingsPage from "@/pages/settings/DisplaySettingsPage";
import PermissionsSettingsPage from "@/pages/settings/PermissionsSettingsPage";
import PrivacyPolictPage from "@/pages/settings/PrivacyPolictPage";
import RegionalSettingsPage from "@/pages/settings/RegionalSettingsPage";
import ReportProblemPage from "@/pages/settings/ReportProblemPage";
import TermsOfServicePage from "@/pages/settings/TermsOfServicePage";
import { Interface__PrivateRoute, Interface__Route } from "./interfaces";

export const ROUTES: Interface__Route[] = [
  {
    path: "/",
    activePath: "/",
    element: <RootPage />,
  },
];

export const PRIVATE_ROUTES: Interface__PrivateRoute[] = [
  {
    path: "/dashboard",
    activePath: "/dashboard",
    titleKey: "navs.dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/administration",
    activePath: "/administration",
    titleKey: "navs.administration",
    element: <AdministrationPage />,
  },
  {
    path: "/services",
    activePath: "/services",
    titleKey: "navs.services",
    element: <ServicePage />,
  },

  // Settings
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
  // {
  //   path: "/profile",
  //   labelKey: "navs.profile",
  //   element: <MerchantProfilePage />,
  // },
];
