import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "./components/ui/provider.tsx";

// Hack: spoof device as non-touch
Object.defineProperty(navigator, "maxTouchPoints", {
  get: () => 0,
});

// Optional: spoof window.ontouchstart
Object.defineProperty(window, "ontouchstart", {
  value: undefined,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    {/* <StrictMode> */}
    <Provider>
      <App />
    </Provider>
    {/* </StrictMode> */}
  </>
);
