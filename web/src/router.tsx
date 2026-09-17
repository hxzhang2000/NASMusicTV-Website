import type { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import ScreensPage from "./pages/ScreensPage";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";

const wrap = (node: ReactNode) => <Layout>{node}</Layout>;

export const router = createBrowserRouter([
  { path: "/", element: wrap(<HomePage />) },
  { path: "/features", element: wrap(<FeaturesPage />) },
  { path: "/screens", element: wrap(<ScreensPage />) },
  { path: "/download", element: wrap(<DownloadPage />) },
  { path: "/about", element: wrap(<AboutPage />) },
  { path: "*", element: wrap(<HomePage />) },
]);
