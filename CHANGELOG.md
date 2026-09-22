# Changelog

本项目所有重要变更均记录在此文件。

- 项目地址：[github.com/hxzhang2000/NASMusicTV-Website](https://github.com/hxzhang2000/NASMusicTV-Website)
- 官网与应用本体独立：应用仓库为 [hxzhang2000/NASMusicTV](https://github.com/hxzhang2000/NASMusicTV)。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)（与 `web/package.json` 中的 `version` 保持一致）。

## [Unreleased]

### 待办 / 已知问题
- （无，已知问题均已在本版清理）

## [1.0.3] - 2026-09-22

维护版（patch）：下载页改版，新增 APK 站内直链下载。

### Added
- 下载页新增「直接下载最新 APK」站内直链与最新版本信息卡（版本号、APK 文件名、覆盖安装提示、GitHub Release 入口），点击即下载，不再绕跳外部页面。
- 仓库根目录 `download/` 接入构建：新增 Vite 插件，构建时自动将 `download/*.apk` 拷入 `dist/download/` 随站点发布（Docker 镜像同样生效）；dev server 同样提供 `/download/` 直链（仅允许纯 `.apk` 文件名，防路径穿越）。
- `site.tsx` 新增 `APK_VERSION` 作为最新 APK 版本唯一来源：文件名（`v2.36.6` → `NASMusicTV-release-v2-36-6.apk`）、下载直链、页面展示版本号均由版本号自动推导，发新版只需替换 `download/` 下的 APK 并改一处常量。
- FAQ 新增「新版本发布后怎么更新」（覆盖安装保留数据）。
- 下载页最新版本卡片内嵌应用最新版「更新内容」：构建时解析应用仓库 `CHANGELOG.md` 最新一节（版本 / 日期 / 摘要 / 新增修复条目）注入页面；本地构建优先读 `../NASMusicTV/CHANGELOG.md`，Docker / CI 回落 `web/src/data/appChangelog.md` 快照。

### Changed
- 下载页重排：原「选择对应架构」改为「一个 APK，全设备适配」（手机 / 平板 / 电视·盒子 / 模拟器四张设备卡），三种架构（ARM64 / ARMv7 / x86_64）改为「安装包内置、安装时自动适配」说明，不再引导用户挑版本。
- 首页 Hero 与底部 CTA、关于页、顶栏右上角的下载按钮全部改为 APK 站内直链（原为跳转 GitHub Releases 或 `/download` 路由页）；`/download` 页面入口保留在导航「下载安装」。
- FAQ「下载哪个安装包」更新为通用 APK 说明；关于页「发布方式」改为单个通用 APK 的描述。
- `deploy/app.conf` nginx 静态缓存规则加入 `apk`（文件名含版本号，长缓存安全）。
- `site.releases` 地址大小写修正（NasMusicTV → NASMusicTV）。

## [1.0.2] - 2026-09-18

维护版（patch）：视觉调整与构建优化。

### Changed
- 首页 Hero 三个按钮（下载 APK / 看看能做什么 / GitHub 源码）缩小并排一行（padding 10px 20px，字号 14px），手机端保持堆叠。
- Highlights 卡片描述精简，每条控制在 1–2 行，不再超长截断。
- Highlights 新增「可视化特效库」（20+ 套全屏特效）与「手机扫码遥控」两个块，共 8 个。
- 构建脚本自动将 `web/dist/` 复制到根目录 `dist/`，适配部署平台无法读取子目录产物的问题。

## [1.0.1] - 2026-09-17

维护版（patch）：收尾清理，无功能变更。

### Removed
- 删除冗余且损坏的 `web/Dockerfile`（引用不存在的 `nginx.conf`；实际构建统一走根 `Dockerfile`，compose 与文档均未引用该文件）。
- 清理 `web/src/data/screenshots.ts` 中未被引用的导出常量（`screenshotTable` / `screenshotSummary` / `requiredScreenshotFiles` / `skippedScreenshotFiles` / `optionalScreenshotFiles`）。

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
