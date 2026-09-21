import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { GlobalContextProvider } from "./context/GlobalContext.jsx";
import App from "./App.jsx";
import "./locales/primeReactPtBr.jsx";

// styles
import "./styles/global.css";

// prime react
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalContextProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </GlobalContextProvider>
  </StrictMode>,
);
