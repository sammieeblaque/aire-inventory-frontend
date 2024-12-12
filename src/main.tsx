import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQueryConfig } from "./constants/index.ts";
import { BrowserRouter, Route, Routes } from "react-router";
import SalesHistoryPage from "./pages/SalesHistory.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: useQueryConfig,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/sales-history" element={<SalesHistoryPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
