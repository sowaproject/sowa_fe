import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

// Local-only design comparison; the production build never enables this preview.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("preview") === "editorial") {
  document.documentElement.classList.add("sowa-editorial-preview");
  void import("./prototypes/editorial.css");
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
