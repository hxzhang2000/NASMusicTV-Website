# Changelog

本项目所有重要变更均记录在此文件。

- 项目地址：[github.com/hxzhang2000/NASMusicTV-Website](https://github.com/hxzhang2000/NASMusicTV-Website)
- 官网与应用本体独立：应用仓库为 [hxzhang2000/NASMusicTV](https://github.com/hxzhang2000/NASMusicTV)。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)（与 `web/package.json` 中的 `version` 保持一致）。

## [Unreleased]

### 待办 / 已知问题
- `web/Dockerfile` 引用了不存在的 `nginx.conf`，将与根 `Dockerfile` 统一。
- 清理 `web/src/data/screenshots.ts` 中未引用的导出常量。

## [1.0.0] - 2026-09-17

首个对外发布的官网版本。

### Added
- 官方 README（替换误植的 Android 应用 README），准确描述本官网技术栈、目录结构、本地运行、截图管理与 Docker 部署。
- CHANGELOG（Keep a Changelog 规范）。
- 网站**独立版本体系**：以 `web/package.json` 的 `version` 为唯一来源，构建时经 Vite `define` 注入 `__APP_VERSION__` / `__APP_BUILD_TIME__`（`web/src/version.ts` 封装为 `SITE_VERSION` / `SITE_BUILD_TIME`），并在页脚与「关于项目」页展示版本号（及构建时间）。
- 仓库地址与官网 / 应用 Issues 区分（README「相关链接」）。

### Changed
- 目录结构与部署说明随实际代码更新。
- 界面截图改为仓库内自托管：16 张 jpg 落地到 `web/public/screens/`（`01-dashboard.jpg` … `16-remote.jpg`），`index.json` 由 GitHub raw 外链改为本地文件名，`index.html` 的 `og:` / `twitter:` 封面图改指本地 `/screens/01-dashboard.jpg`，移除对 `raw.githubusercontent.com` 的依赖。

## [0.1.0] - 2026-09-17

首个官网版本，对应 NAS Music TV 应用官网落地页的初版上线。

### Added
- 官网前端工程（`web/`）：Vite 5 + React 18 + TypeScript + Ant Design 5。
- 强制深色主题的全局设计系统（青绿品牌色 `#00D4AA`），色板与组件收敛在 `web/src/styles/`。
- 5 个路由页：
  - 首页（`/`）：Hero、统计数字、Highlights、15 大功能模块、TV 界面 mockup、CTA。
  - 功能特性（`/features`）：锚点导航 + 全部功能模块清单。
  - 界面预览（`/screens`）：16 个界面截图位，支持 TV / 手机切换与空帧降级。
  - 下载安装（`/download`）：架构选择（ARM64 / ARMv7 / x86_64）+ FAQ。
  - 关于项目（`/about`）：版本 / 开源协议 / 已接入服务与 API 清单。
- 纯 CSS 界面 mockup 与内联 SVG 图标集（`TvIcons.tsx`），首屏零图片 / 零图标字体请求。
- 界面截图加载机制（`useScreenshots` + `index.json`）：支持本地文件 / 图床外链 / 别名三种来源，缺失自动渲染空帧不破图。
- 响应式布局（1024 / 720 / 1279 / 767px 断点）与移动端汉堡菜单。
- 可访问性：键盘焦点态、`prefers-reduced-motion` 兜底、装饰元素 `aria-hidden`。
- 多阶段 Docker 构建（Node 20 构建 → nginx 1.27 托管）与 `deploy/app.conf`（SPA 回退 / gzip / 健康检查）。
- SEO 元信息（`index.html` 的 `og:` / `twitter:` 卡片）。

### Changed
- 无（初版）。

### Fixed
- 无（初版）。

### Removed
- 无（初版）。

---

## 版本说明

- `0.1.0`：官网初版，与应用本体 v2.x 同期对外展示。
- 后续版本号在 `web/package.json` 中维护；每次发布在此处追加对应条目。
