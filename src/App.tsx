import { ChakraProvider } from "@chakra-ui/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import { useColorMode } from "./components/ui/color-mode";
import { toaster, Toaster } from "./components/ui/toaster";
import OfflineDisclosure from "./components/widget/OfflineDisclosure";
import useADM from "./context/useADM";
import useLang from "./context/useLang";
import useOffline from "./context/useOffilne";
import { useThemeConfig } from "./context/useThemeConfig";
import useScrollEffect from "./hooks/useScrollEffect";
import Routing from "./routes/Routing";
import theme from "./theme";
import useStatusBarColor from "./utils/statusBarColor";

const EndpointWrapper = ({ children }: { children: React.ReactNode }) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  // Utils
  const location = useLocation();
  const setStatusBarPrimary = useStatusBarColor(
    themeConfig.primaryColorHex,
    themeConfig.primaryColorHex
  );
  const setStatusBarBody = useStatusBarColor("#ffffff", "#101010");
  const setStatusBarDark = useStatusBarColor("#101010", "#101010");

  // Handle notif bar color
  useEffect(() => {
    // Dapatkan endpoint dari lokasi saat ini
    const endpoint = location.pathname;
    switch (endpoint) {
      default:
        setStatusBarBody();
        break;
      case "beranda":
        setStatusBarPrimary();
        break;
      case "employee/foto":
        setStatusBarDark();
        break;
    }
  }, [location, setStatusBarBody, setStatusBarDark]);

  return <>{children}</>;
};

function App() {
  // Contexts
  const { l } = useLang();
  const { setOffline } = useOffline();
  const { ADM } = useADM();
  const { setColorMode } = useColorMode();

  // States, Refs
  const [firstRender, setFirstRender] = useState<boolean>(true);

  // Utils
  function handleOnline() {
    setOffline(false);
    if (!firstRender) {
      toaster.success({
        title: l.back_online_toast.title,
        description: l.back_online_toast.description,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    }
  }
  function handleOffline() {
    setOffline(true);
  }

  // Handle scroll style
  useScrollEffect();

  // Handle offline online
  useEffect(() => {
    // Tambahkan event listener
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [firstRender]);

  // Hide online toast when first render
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    }
  }, [firstRender]);

  // Handle adaptive dark mode (ADM)
  useEffect(() => {
    if (ADM === "false") return;

    const updateDarkMode = () => {
      const hour = new Date().getHours();
      setColorMode(hour >= 18 || hour < 6 ? "dark" : "light"); // Dark mode 18:00 ~ 06:00
    };

    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      setColorMode("dark");
    } else {
      setColorMode("light");
    }

    // Check only at 18:00 and 06:00
    const nextCheckTime = hour >= 18 || hour < 6 ? 24 - hour + 6 : 18 - hour;
    const timeout = setTimeout(updateDarkMode, nextCheckTime * 60 * 60 * 1000); // Set the next check time

    return () => clearTimeout(timeout);
  }, [ADM, setColorMode]);

  return (
    <ChakraProvider value={theme}>
      <Toaster />
      <BrowserRouter>
        <OfflineDisclosure />

        <EndpointWrapper>
          <Routing />
        </EndpointWrapper>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
