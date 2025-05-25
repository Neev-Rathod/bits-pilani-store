import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ItemsProvider } from "./contexts/ItemsContext.jsx";
import { HeightContext, HeightProvider } from "./contexts/HeightContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ItemsProvider>
        <HeightProvider>
          <App />
        </HeightProvider>
      </ItemsProvider>
    </BrowserRouter>
  </StrictMode>
);
