import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import App from "./App";
import "./styles.css";

/**
 * 全站为深色背景，antd 必须使用深色算法，
 * 否则 <App> 容器会注入浅色主题文字色（黑字），导致标题等文字在深色底上看不清。
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        /* 【美化要点】品牌主色统一为产品 TV 端的青绿选中态 #00D4AA，
           背景基准色对齐深色沉浸设计系统 #0A0E14，全站视觉语言一致。 */
        token: {
          colorPrimary: "#00d4aa",
          colorInfo: "#00d4aa",
          colorLink: "#00d4aa",
          colorTextBase: "#ffffff",
          colorBgBase: "#0a0e14",
          borderRadius: 12,
          fontSize: 14,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
