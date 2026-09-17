import { useEffect, useState } from "react";
import {
  SCREENSHOT_DIR,
  allScreenshotFiles,
  aliasVariants,
  baseName,
  fileVariants,
} from "../data/screenshots";

/** 探测结果全局缓存：槽位名 → 实际资源（本地文件名，或图床/CDN 的完整 URL），整站只探测一次 */
let cache: Map<string, string> | null = null;

/**
 * 把「资源标识」转成可直接放进 <img src> 的地址。
 * - 以 http:// https:// // 开头的 → 视为外部图床 / CDN 地址，原样使用
 * - 以 / 开头的 → 视为站点绝对路径，原样使用
 * - data: / blob: → 原样使用
 * - 其余（如 01-dashboard.png）→ 拼上 public/screens/ 前缀
 */
export const assetUrl = (file: string): string => {
  if (/^(https?:)?\/\//i.test(file)) return file;
  if (/^(data|blob):/i.test(file)) return file;
  if (file.startsWith("/")) return file;
  return SCREENSHOT_DIR + file;
};

/** 判断单张图片是否存在（不开启网络请求缓存，避免拿到旧的 404） */
const exists = (fileName: string) =>
  new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = assetUrl(fileName);
  });

/**
 * 优先读取清单 web/public/screens/index.json，一次请求搞定，完全不做逐张探测。
 *
 * 清单支持三种写法（可混用）：
 *   1) 数组 + 本地文件名：  "files": ["01-dashboard.png", "02-player.jpg"]
 *   2) 数组 + 外链：        "files": ["https://cdn.example.com/01-dashboard.png"]
 *   3) 对象（槽位 → 地址）："files": { "01-dashboard": "https://…/a.png", "02-player": "02-player.png" }
 *                          也可写 "urls": { … }（等价）
 * 「键」取槽位名（01-dashboard，带不带后缀都行），值可以是本地文件名，也可以是完整 URL。
 * 想把截图放图床/CDN（不把图片提交进仓库）时用第 3 种写法最直观。
 */
async function fromManifest(): Promise<Map<string, string> | null> {
  try {
    const res = await fetch(SCREENSHOT_DIR + "index.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { files?: unknown; urls?: unknown };
    const map = new Map<string, string>();

    const pushLocal = (value: string) => {
      if (value) map.set(baseName(value), value);
    };
    const pushPair = (slot: string, value: unknown) => {
      if (typeof slot !== "string" || typeof value !== "string" || !value) return;
      const key = baseName(slot) || baseName(value);
      if (key) map.set(key, value);
    };

    if (Array.isArray(data.files)) {
      data.files.forEach((item) => {
        if (typeof item === "string") pushLocal(item);
      });
    } else if (data.files && typeof data.files === "object") {
      Object.entries(data.files as Record<string, unknown>).forEach(([slot, value]) =>
        pushPair(slot, value)
      );
    }
    if (data.urls && typeof data.urls === "object" && !Array.isArray(data.urls)) {
      Object.entries(data.urls as Record<string, unknown>).forEach(([slot, value]) =>
        pushPair(slot, value)
      );
    }

    return map.size > 0 ? map : null;
  } catch {
    return null;
  }
}

/** 没有清单时的兜底探测：规范名（4 种后缀）+ 别名（.png / .jpg） */
async function probe(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  await Promise.all(
    allScreenshotFiles.map(async (file) => {
      const candidates = [...fileVariants(file), ...aliasVariants(file)];
      for (const candidate of candidates) {
        if (await exists(candidate)) {
          map.set(baseName(file), candidate);
          return;
        }
      }
    })
  );
  return map;
}

/**
 * 自动解析每张截图的真实地址。
 *
 * 图片来源有三种，按优先级：
 *   1) public/screens/index.json 清单（可写本地文件名，也可写图床 / CDN 的外链）
 *   2) public/screens/ 下的本地图片（自动识别 .png / .jpg / .jpeg / .webp）
 *   3) 「省事命名」别名（首页.png、01.png …）
 * 都找不到 → 对应位置渲染空帧，不会出现破图。
 */
export function useScreenshots() {
  const [found, setFound] = useState<Map<string, string>>(cache ?? new Map());

  useEffect(() => {
    if (cache) {
      setFound(cache);
      return;
    }
    let alive = true;
    (async () => {
      const result = (await fromManifest()) ?? (await probe());
      cache = result;
      if (alive) setFound(new Map(result));
    })();
    return () => {
      alive = false;
    };
  }, []);

  /** 槽位名 → 可直接用于 <img src> 的地址；不存在返回 null */
  const resolve = (file?: string): string | null => {
    if (!file) return null;
    const hit = found.get(baseName(file));
    return hit ? assetUrl(hit) : null;
  };

  const has = (file?: string): boolean => !!resolve(file);

  /** 按顺序返回第一个可用地址（都没有则 null），用于主图缺失时回退到备选图 */
  const firstOf = (...files: (string | undefined)[]): string | null => {
    for (const f of files) {
      const hit = resolve(f);
      if (hit) return hit;
    }
    return null;
  };

  return { screenshots: found, has, resolve, firstOf, assetUrl, dir: SCREENSHOT_DIR };
}
