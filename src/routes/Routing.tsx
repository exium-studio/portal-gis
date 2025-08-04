import NavsContainer from "@/components/widget/NavsContainer";
import {
  PRIVATE_ROUTES,
  PRIVATE_ROUTES_MASTER_DATA,
  PRIVATE_ROUTES_SETTINGS,
  ROUTES,
} from "@/constants/routes";
import useLang from "@/context/useLang";
import MaintenancePage from "@/pages/_error/MaintenancePage";
import MissingPage from "@/pages/_error/MissingPage";
import ServerErrorPage from "@/pages/_error/ServerErrorPage";
import pluck from "@/utils/pluck";
import { Route, Routes } from "react-router-dom";
import AuthMiddleware from "./AuthMiddleware";
import MasterDataNavsContainer from "@/components/widget/MasterDataNavsContainer";
import SettingsNavsContainer from "@/components/widget/SettingsNavsContainer";

const Routing = () => {
  // Contexts
  const { l } = useLang();

  return (
    <Routes>
      {ROUTES.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {PRIVATE_ROUTES.map((route) => {
        const {
          path,
          activePath,
          backPath,
          titleKey,
          element,
          allowedPermissions,
        } = route;

        return (
          <Route
            key={path}
            path={path}
            element={
              <AuthMiddleware allowedPermissions={allowedPermissions}>
                <NavsContainer
                  activePath={activePath}
                  title={pluck(l, titleKey)}
                  backPath={backPath}
                  withMaps
                >
                  {element}
                </NavsContainer>
              </AuthMiddleware>
            }
          />
        );
      })}

      {PRIVATE_ROUTES_MASTER_DATA.map((route) => {
        const {
          path,
          activePath,
          backPath,
          titleKey,
          element,
          allowedPermissions,
        } = route;

        return (
          <Route
            key={path}
            path={path}
            element={
              <AuthMiddleware allowedPermissions={allowedPermissions}>
                <NavsContainer
                  activePath={activePath}
                  title={pluck(l, titleKey)}
                  backPath={backPath}
                  withMaps
                >
                  <MasterDataNavsContainer activePath={path}>
                    {element}
                  </MasterDataNavsContainer>
                </NavsContainer>
              </AuthMiddleware>
            }
          />
        );
      })}

      {PRIVATE_ROUTES_SETTINGS.map((route) => {
        const {
          path,
          activePath,
          backPath,
          titleKey,
          element,
          allowedPermissions,
        } = route;

        return (
          <Route
            key={path}
            path={path}
            element={
              <AuthMiddleware allowedPermissions={allowedPermissions}>
                <NavsContainer
                  activePath={activePath}
                  title={pluck(l, titleKey)}
                  backPath={backPath}
                  withMaps
                >
                  <SettingsNavsContainer activePath={path}>
                    {element}
                  </SettingsNavsContainer>
                </NavsContainer>
              </AuthMiddleware>
            }
          />
        );
      })}

      <Route path="*" element={<MissingPage />} />
      <Route path="/server-error" element={<ServerErrorPage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
    </Routes>
  );
};

export default Routing;
