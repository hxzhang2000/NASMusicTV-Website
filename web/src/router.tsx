import type { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import ScreensPage from "./pages/ScreensPage";
import EffectsPage from "./pages/EffectsPage";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";

const wrap = (node: ReactNode) => <Layout>{node}</Layout>;

// BASE_URL 始终以 "/" 结尾；根域名部署时去掉斜杠后为空串，回退到 "/"
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter(
  [
    { path: "/", element: wrap(<HomePage />) },
    { path: "/features", element: wrap(<FeaturesPage />) },
    { path: "/screens", element: wrap(<ScreensPage />) },
    { path: "/effects", element: wrap(<EffectsPage />) },
    { path: "/download", element: wrap(<DownloadPage />) },
    { path: "/about", element: wrap(<AboutPage />) },
    { path: "*", element: wrap(<HomePage />) },
  ],
  { basename }
);
