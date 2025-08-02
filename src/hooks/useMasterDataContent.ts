import { useLocation } from "react-router-dom";
import useScreen from "./useScreen";

export function useMasterDataContent(masterDataPath: string = "/master-data") {
  const location = useLocation();

  const masterDataRoute = location.pathname === masterDataPath;
  const { sw } = useScreen();
  const siss = sw < 1200;

  return { masterDataRoute, siss };
}
