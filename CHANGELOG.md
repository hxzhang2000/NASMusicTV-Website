# Changelog

本项目所有重要变更均记录在此文件。

- 项目地址：[github.com/hxzhang2000/NASMusicTV-Website](https://github.com/hxzhang2000/NASMusicTV-Website)
- 官网与应用本体独立：应用仓库为 [hxzhang2000/NASMusicTV](https://github.com/hxzhang2000/NASMusicTV)。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)（与 `web/package.json` 中的 `version` 保持一致）。

## [Unreleased]

### Added
- 新增 GitHub Pages 发布工作流 `.github/workflows/deploy-pages.yml`：推送 `main` 即构建并部署到项目站点，产物复制 `index.html → 404.html` 承接深链回退（Pages 无 `try_files`），`web/public/.nojekyll` 关闭 Jekyll 处理。
- 站点支持子路径部署：Vite `base` 由 `VITE_BASE` 注入（默认 `/`，NAS / Docker 产物不变），路由 `basename`、`APK_DOWNLOAD_URL`、`EFFECTS_DIR` 统一跟随 `import.meta.env.BASE_URL`。

### 待办 / 已知问题
- `web/index.html` 的 `og:image` 仍是相对路径，社交爬虫取不到分享封面；Pages 子路径下也需绝对 URL 才生效（正式入口建议自建域名后填绝对地址）。

## [1.0.7] - 2026-10-17

小功能版（minor）：新增「特效图集」页面，集中展示可视化舞台各效果的画面快照。

### Added
- 新增 `/effects` 特效图集页（`web/src/pages/EffectsPage.tsx`）：25 张端上实拍快照的响应式网格（4/3/2/1 列自适应），点击任意画面进入灯箱放大浏览（←/→ 切换、Esc 关闭、首尾循环、焦点管理与 reduced-motion 适配），图片懒加载并带加载失败降级占位。
- 新增单一数据源 `web/src/data/effects.ts`：枚举名 → 中文效果名对照表（25 条），页面与灯箱共用，计数由数组长度推导。
- 图集素材入库：快照源目录 `docs/snapshot/`，站点静态目录 `web/public/effects/`（构建随站点发布）。

### Changed
- 顶栏导航与页脚「产品」链接列新增「特效图集」入口（界面预览之后）。
- 首页 Highlights「可视化特效库」卡片整卡改为链接至 `/effects`，附「查看特效图集 →」提示。
- 网站版本号 `web/package.json` 1.0.6 → 1.0.7。

## [1.0.6] - 2026-10-17

维护版（patch）：随应用 v2.38.12 → v2.38.15 同步官网文案与最新 APK。

### Changed
- 最新 APK 版本 `APK_VERSION` 由 `v2.38.11` 升到 `v2.38.15`（`download/` 与 `dist/download/` 下的 APK 已同步替换，下载页文件名与直链自动推导）。
- 下载页「更新摘要」改为 v2.38.12 → v2.38.15 四条（`recentChangelog` + `CHANGELOG_RANGE`）：新增第 25 套「鸟群」与第 26 套「大漠孤烟」、播放统计「最爱歌手」拆分合唱曲目、K 歌分离失败详情与设备诊断。
- 可视化特效计数由 24 套更正为 **26 套**（首页统计、Highlights、功能特性与界面预览统一更新，效果列表补入「鸟群」「大漠孤烟」）。
- 功能特性补入「分离失败诊断」与播放统计「最爱歌手按人分列」条目；设置页界面预览文案补「上次分离失败详情」。
- 应用 CHANGELOG 快照 `web/src/data/appChangelog.md` 刷新至 v2.38.15。
- 网站版本号 `web/package.json` 1.0.5 → 1.0.6；README 同步版本号与 `APK_VERSION` 示例。

## [1.0.5] - 2026-10-15

维护版（patch）：随应用 v2.38.8 → v2.38.11 同步官网文案与最新 APK。

### Changed
- 最新 APK 版本 `APK_VERSION` 由 `v2.38.7` 升到 `v2.38.11`（`download/` 与 `dist/download/` 下的 APK 已同步替换，下载页文件名与直链自动推导）。
- 下载页「更新摘要」改为 v2.38.8 → v2.38.11 四条（`recentChangelog` + `CHANGELOG_RANGE`）：新增第 23 套「迷雾之战」与第 24 套「雪松」、K 歌页升降调 / 变速即时试听、网络歌曲 301 重定向解析修复与心跳波形修复。
- 可视化特效计数由 22 套更正为 **24 套**（首页统计、Highlights、功能特性、界面预览与 ScreensPage / HomePage 提示文案统一更新，效果列表补入「迷雾之战」「雪松」）。
- K 歌页界面预览文案补「即时试听：弹窗内 ←/→ 换档当场生效，确定才保存」。
- 应用 CHANGELOG 快照 `web/src/data/appChangelog.md` 刷新至 v2.38.11。
- 网站版本号 `web/package.json` 1.0.4 → 1.0.5；README 同步版本号与 `APK_VERSION` 示例。

## [1.0.4] - 2026-10-11

维护版（patch）：随应用 v2.38.3 → v2.38.7 同步官网文案与最新 APK 版本。

### Changed
- 最新 APK 版本 `APK_VERSION` 由 `v2.38.2` 升到 `v2.38.7`（`download/` 下的 APK 已同步替换，下载页文件名与直链自动推导）。
- 下载页「更新摘要」改为 v2.38.3 → v2.38.7 五条（`recentChangelog` + `CHANGELOG_RANGE`）：本地音乐总开关与权限瘦身、飞牛访问码、太阳系 / 海边 / 明月等可视化改动、网络搜索艺人全量展开与「可能无版权」标注。
- 首页统计与 Highlights、功能特性（网络音乐 / 本地音乐 / 播放控制 / 设置 / 手机适配 / 曲库浏览）、界面预览（可视化舞台 / 设置页 / 连接页 / 关于页）文案同步应用最新状态：可视化特效由 21 套更正为 **22 套**（新增「明月」），补入应用内音量、可视化画质三档、本地音乐总开关、飞牛访问码等条目。
- 删除「电池优化白名单引导」等已随应用权限瘦身下线的描述（应用不再申请存储 / 通知 / 麦克风权限，也不再引导加入电池优化白名单）；各页面残留的「30+ 套特效」统一更正为 22 套。
- FAQ 新增「为什么安装后没有自动扫描本地音乐」与「搜索里标注『可能无版权』的歌能播吗」两条。
- 应用 CHANGELOG 快照 `web/src/data/appChangelog.md` 刷新至 v2.38.7。
- 网站版本号 `web/package.json` 1.0.3 → 1.0.4；README 同步版本、下载说明与目录结构（补 `download/`）。

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
