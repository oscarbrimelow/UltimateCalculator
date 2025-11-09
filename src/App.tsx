import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Layout } from "./components/layout/Layout";
import { LoadingScreen } from "./components/ui/LoadingScreen";

const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const OfflinePage = lazy(() => import("./pages/OfflinePage"));

const App = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Suspense fallback={<LoadingScreen label="Loading UltimateCalc…" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/calculator/:calculatorId" element={<CalculatorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/offline" element={<OfflinePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
};

export default App;

