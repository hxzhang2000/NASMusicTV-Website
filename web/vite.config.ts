import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  cpSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * 网站独立版本体系：package.json 的 version 是唯一来源。
 * 构建时注入到代码中（`__APP_VERSION__` / `__APP_BUILD_TIME__`），
 * 因此改版本只需 `npm version` 或编辑 package.json，界面会自动同步。
 */
const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL("./package.json", import.meta.url)), "utf-8")
);
const buildTime = new Date().toISOString().slice(0, 16).replace("T", " ");

/** 仓库根目录的 APK 下载目录（发新版本时替换其中的 APK 文件即可） */
const apkSourceDir = fileURLToPath(new URL("../download", import.meta.url));

/* --------------------------------------------------------------------------
 * 应用最新版 CHANGELOG 注入
 * 来源优先级：
 *   1. 应用仓库 ../NASMusicTV/CHANGELOG.md（本地构建，随应用发版自动同步）
 *   2. 本仓库 web/src/data/appChangelog.md 快照（Docker / CI 构建上下文里没有应用仓库）
 * 解析出最新一节（版本、日期、一句话摘要、Added/Fixed 分区条目），
 * 以 __APP_CHANGELOG_LATEST__ 注入下载页；解析不到时注入空结构，页面自动隐藏。
 * -------------------------------------------------------------------------- */
interface AppChangelogSection {
  label: string;
  items: string[];
}
interface AppChangelogLatest {
  version: string;
  date: string;
  summary: string;
  sections: AppChangelogSection[];
}

const CHANGELOG_SECTION_LABELS: Record<string, string> = {
  Added: "新增",
  Changed: "变更",
  Fixed: "修复",
  Removed: "移除",
  Security: "安全",
  Deprecated: "弃用",
};

function parseAppChangelog(text: string): AppChangelogLatest | null {
  const m = text.match(
    /^##\s+\[?(v?\d+(?:\.\d+)*)\]?\s*-\s*(\d{4}-\d{2}-\d{2})[^\n]*\n([\s\S]*?)(?=\n##\s|(?![\s\S]))/m
  );
  if (!m) return null;
  const [, version, date, body] = m;
  const summaryMatch = body.match(/^>\s*\*\*(.+?)\*\*\s*$/m);
  const summary = summaryMatch ? summaryMatch[1].trim() : "";

  const sections: AppChangelogSection[] = [];
  let current: AppChangelogSection | null = null;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(">") || /^-{3,}$/.test(line)) continue; // 空行 / 摘要引用 / 分隔线
    const heading = line.match(/^#{2,4}\s+(.+)$/);
    if (heading) {
      const label = heading[1].trim();
      current = { label: CHANGELOG_SECTION_LABELS[label] ?? label, items: [] };
      sections.push(current);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      current?.items.push(bullet[1].replace(/[*`]/g, "").trim());
      continue;
    }
    // bullet 换行续写（中文文案直接拼接）
    if (current && current.items.length > 0) {
      current.items[current.items.length - 1] += line;
    }
  }
  return {
    version,
    date,
    summary,
    sections: sections.filter((s) => s.items.length > 0),
  };
}

function readAppChangelog(): AppChangelogLatest | null {
  const sources = [
    fileURLToPath(new URL("../NASMusicTV/CHANGELOG.md", import.meta.url)),
    fileURLToPath(new URL("./src/data/appChangelog.md", import.meta.url)),
  ];
  for (const file of sources) {
    if (!existsSync(file)) continue;
    try {
      const parsed = parseAppChangelog(readFileSync(file, "utf-8"));
      if (parsed) return parsed;
    } catch {
      // 尝试下一个来源
    }
  }
  return null;
}

const appChangelog = readAppChangelog();
if (!appChangelog) {
  console.warn("[app-changelog] 未找到可解析的应用 CHANGELOG，下载页将隐藏「更新内容」块");
} else {
  // 与 site.tsx 的 APK_VERSION 对账，版本不一致时提醒（不阻断构建）
  try {
    const siteTs = readFileSync(
      fileURLToPath(new URL("./src/data/site.tsx", import.meta.url)),
      "utf-8"
    );
    const apkVersion = siteTs.match(/APK_VERSION\s*=\s*"(v?[\d.]+)"/)?.[1];
    if (apkVersion && apkVersion !== appChangelog.version) {
      console.warn(
        `[app-changelog] CHANGELOG 最新版 (${appChangelog.version}) 与 APK_VERSION (${apkVersion}) 不一致，请检查是否已同步`
      );
    }
  } catch {
    // 对账失败不影响构建
  }
}

/**
 * APK 直链下载接入：
 * - 构建：把仓库根目录 download/ 下的 *.apk 拷进 dist/download/，随站点一起发布；
 *   构建脚本随后会把 web/dist 整体拷到根 dist/，Docker 镜像内同样生效。
 * - 开发：dev server 以 /download/<文件名> 直接提供同一目录，本地也能验证直链。
 * 文件名含版本号（如 NASMusicTV-release-v2-36-5.apk），版本号只需改 site.tsx 的 APK_VERSION。
 */
function apkDownloadPlugin(): Plugin {
  const listApks = () =>
    existsSync(apkSourceDir)
      ? readdirSync(apkSourceDir).filter((f) => f.toLowerCase().endsWith(".apk"))
      : [];

  return {
    name: "apk-download-dir",
    // 构建结束后拷贝 APK 到产物目录
    closeBundle() {
      const apks = listApks();
      if (apks.length === 0) {
        this.warn("download/ 下未找到 APK，下载页直链将不可用");
        return;
      }
      const targetDir = fileURLToPath(new URL("./dist/download", import.meta.url));
      mkdirSync(targetDir, { recursive: true });
      for (const apk of apks) {
        cpSync(`${apkSourceDir}/${apk}`, `${targetDir}/${apk}`);
      }
    },
    // 开发服务器直接提供 download/ 目录
    configureServer(server) {
      server.middlewares.use("/download", (req, res, next) => {
        const name = decodeURIComponent((req.url ?? "").split("?")[0].replace(/^\//, ""));
        // 仅允许纯文件名，拒绝路径穿越；只服务 .apk
        if (!/^[A-Za-z0-9._-]+\.apk$/i.test(name)) return next();
        const file = `${apkSourceDir}/${name}`;
        if (!existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader("Content-Type", "application/vnd.android.package-archive");
        res.setHeader("Content-Length", statSync(file).size);
        res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
        createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), apkDownloadPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_TIME__: JSON.stringify(buildTime),
    __APP_CHANGELOG_LATEST__: JSON.stringify(
      appChangelog ?? { version: "", date: "", summary: "", sections: [] }
    ),
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
