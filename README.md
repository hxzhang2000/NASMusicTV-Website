# NASMusicTV-Website

NAS Music TV 的**官方网站**（落地页）。一个纯前端的单页站点，用于介绍这款开源的 Android 多源音乐播放器（TV / 手机 / 平板通用）：聚合 NAS、网络音乐与百度网盘多音乐源，支持逐字卡拉OK歌词、K 歌伴奏、MTV、天气电台等电视专属体验。

> 本仓库只托管**官网前端**，源码位于 [`hxzhang2000/NASMusicTV-Website`](https://github.com/hxzhang2000/NASMusicTV-Website)。Android 应用本体在 [`hxzhang2000/NASMusicTV`](https://github.com/hxzhang2000/NASMusicTV)，下载 APK 请前往该仓库的 Releases。

[![Release](https://img.shields.io/github/v/release/hxzhang2000/NASMusicTV?color=blue&label=App%20Release)](https://github.com/hxzhang2000/NASMusicTV/releases)
[![Website](https://img.shields.io/badge/website-repo-00d4aa?logo=github)](https://github.com/hxzhang2000/NASMusicTV-Website)

---

## 技术栈

- **构建**：[Vite](https://vitejs.dev/) 5 + TypeScript 5
- **框架**：React 18
- **UI**：[Ant Design](https://ant.design/) 5（强制深色主题 `theme.darkAlgorithm`）+ `@ant-design/icons`
- **路由**：`react-router-dom` 6（`createBrowserRouter` + `RouterProvider`）
- **部署**：多阶段 Docker 构建（Node 20 构建 → nginx 1.27 托管静态产物）

整个网站**不依赖任何后端**：界面截图通过 `index.json` 清单加载（支持本地文件 / 图床外链 / 别名三种来源），缺失时自动渲染 CSS 绘制的空帧占位，不会出现破图。

---

## 功能特性（站点本身）

- **5 个路由页**：首页（`/`，含 Hero、统计、Highlights、功能模块、TV 界面 mockup、CTA）、功能特性（`/features`，锚点导航 + 15 大模块）、界面预览（`/screens`）、下载安装（`/download`，架构选择 + FAQ）、关于项目（`/about`，版本/开源协议/API 清单）。
- **深色沉浸设计系统**：统一的青绿品牌色（`#00D4AA`）、等宽大字统计、卡片悬浮焦点态，色板与组件全部收敛在 `web/src/styles/` 下。
- **纯 CSS 界面 mockup + 内联 SVG 图标**：首页 TV 界面预览与全部图标均为手写 CSS / SVG，**首屏零图片与零图标字体请求**。
- **响应式**：桌面 / 平板 / 手机三档断点（1024 / 720 / 1279 / 767px），手机端导航折叠为汉堡菜单，小字放大到 ≥15px 保证可读性。
- **可访问性**：`prefers-reduced-motion` 全站兜底、键盘 `:focus-visible` 青绿描边、装饰元素 `aria-hidden`、语义图标带 `aria-label`。
- **滚动渐入**：首页用 Intersection Observer 触发，用户关闭系统动效时直接显示，不做任何动画。

---

## 目录结构

```
NASMusicTV-Website/
├── Dockerfile            # 多阶段构建：web 构建 → nginx 托管
├── docker-compose.yml    # web 服务编排（部署平台用）
├── deploy/
│   └── app.conf          # nginx 配置（SPA 回退 + gzip + 健康检查）
├── db/                   # 占位（本仓库无后端数据库）
└── web/                  # 官网前端工程
    ├── index.html        # 入口 + SEO meta（og:image / twitter:image）
    ├── vite.config.ts
    ├── package.json
    ├── public/screens/   # 界面截图清单（index.json / urls.txt）
    ├── scripts/          # fetch-screenshots.sh / place-screenshots.sh
    └── src/
        ├── main.tsx      # 入口：ConfigProvider(dark) + AntApp
        ├── App.tsx       # RouterProvider
        ├── router.tsx    # 5 条路由 + 兜底
        ├── components/
        │   ├── Layout.tsx        # 顶栏导航 + 页脚
        │   ├── Screenshot.tsx    # 截图位组件（TV/手机切换、空帧降级）
        │   └── TvIcons.tsx       # 内联 SVG 图标集
        ├── data/
        │   ├── site.tsx          # 站点文案（highlights / featureModules / screens / faqs / apiVersions）
        │   └── screenshots.ts    # 截图槽位清单与解析逻辑
        ├── hooks/
        │   └── useScreenshots.ts # 清单优先 / 逐张探测兜底
        ├── pages/        # HomePage / FeaturesPage / ScreensPage / DownloadPage / AboutPage
        └── styles/       # styles.css（全站）+ home.css（首页 TV 设计系统）
```

---

## 本地运行

### 环境要求

- Node.js 20+（Docker 构建使用 `node:20-alpine`）
- npm 9+

### 安装与启动

```bash
cd web

# 安装依赖
npm install

# 本地开发（默认 http://localhost:5174，监听 0.0.0.0）
npm run dev

# 类型检查 + 生产构建（产物在 web/dist）
npm run build

# 本地预览构建产物（默认 http://localhost:4173）
npm run preview
```

> 开发服务器端口由 `web/vite.config.ts` 的 `server.port`（当前 `5174`）决定。

---

## 界面截图管理

界面预览页（`/screens`）与首页 Hero 的图片来自 `web/public/screens/index.json` 清单。三种来源按优先级取：

1. **`index.json` 清单**（推荐）：可写本地文件名，也可写图床 / CDN / GitHub 外链。
2. **`web/public/screens/` 本地图片**：自动识别 `.png` / `.jpg` / `.jpeg` / `.webp`。
3. **别名**：`01.png`、`首页.png`、`01-首页.jpg` 等同样会被识别。

清单支持两种写法：

```jsonc
// 写法 A：对象（槽位名 → 地址），外链/本地均可
{ "urls": { "01-dashboard": "https://cdn.example.com/01-dashboard.png" } }

// 写法 B：数组（本地文件名或外链）
{ "files": ["01-dashboard.png", "https://cdn.example.com/02-player.jpg"] }
```

批量更新截图：编辑 `web/public/screens/urls.txt`（每行「槽位名 网址」），执行

```bash
bash web/scripts/fetch-screenshots.sh
```

脚本会下载图片到 `web/public/screens/` 并重写 `index.json`。某张图缺失不会破图，对应位置仅显示界面名空帧。

> ✅ 16 张界面截图已自托管于 `web/public/screens/`（`01-dashboard.jpg` … `16-remote.jpg`），`index.json` 指向本地文件名，官网可离线、稳定加载，不再依赖 `raw.githubusercontent.com` 外链。换图只需替换对应文件即可。

---

## 部署（Docker）

```bash
# 构建镜像（开发平台执行；可注入 NPM_REGISTRY 加速）
docker compose build

# 本地起一个 nginx 容器预览
docker build -t nasmtv-web .
docker run --rm -p 8080:80 nasmtv-web
# 打开 http://localhost:8080
```

- 多阶段构建：先 `npm run build` 产出 `web/dist`，再拷入 `nginx:1.27-alpine`，由 `deploy/app.conf` 托管。
- `app.conf` 已配置 SPA history 回退（`try_files $uri $uri/ /index.html`）、静态资源长期缓存、gzip 与 `/nginx-health` 健康检查。
- `docker-compose.yml` 用于部署平台的 Swarm 编排（Traefik 标签由平台注入）。

---

## 相关链接

- **官网源码（本站）**：[hxzhang2000/NASMusicTV-Website](https://github.com/hxzhang2000/NASMusicTV-Website)
- 应用源码与 APK 下载：[hxzhang2000/NASMusicTV](https://github.com/hxzhang2000/NASMusicTV)
- 应用版本发布记录：[Releases](https://github.com/hxzhang2000/NASMusicTV/releases)
- 官网问题反馈（文档 / 样式 / 部署）：[Website Issues](https://github.com/hxzhang2000/NASMusicTV-Website/issues)
- 应用问题反馈（APK / 功能）：[App Issues](https://github.com/hxzhang2000/NASMusicTV/issues)

## 开源协议

本站与 NAS Music TV 应用本体一同以 **GPL v3** 协议开源。

## 版本

- 网站有**独立于 Android 应用**的版本号，唯一来源是 `web/package.json` 的 `version` 字段（当前 `1.0.1`）。
- 升级版本只需 `npm version <patch|minor|major>` 或手动修改该字段，重新构建后界面（页脚 + 关于页）会自动同步，无需改代码。
- 版本号与构建时间由 Vite 在构建时注入（`web/src/version.ts` → `SITE_VERSION` / `SITE_BUILD_TIME`）。
