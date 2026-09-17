/**
 * 内联 SVG 线性图标集（TV 设计系统专用）
 *
 * 【美化要点】按需求「不新增任何第三方 UI 库或图标库」：
 * 全部图标为手写内联 SVG（stroke 线性风格，24×24 viewBox，currentColor 上色），
 * 不引入任何额外依赖，也不额外产生字体图标 / 图片请求（首屏零图标请求）。
 * 装饰性图标统一 aria-hidden，语义图标由调用方传 title 生成 role="img" + aria-label。
 */
import React from "react";

/** 图标路径表：每个值都是 24×24 视口下的 stroke 路径 */
const PATHS: Record<string, React.ReactNode> = {
  /* ---- 功能 / 卖点 ---- */
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.6V20h13V9.6" />
      <path d="M9.5 20v-5.6h5V20" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  folder: (
    <path d="M3 7.4A2 2 0 0 1 5 5.4h3.6l2 2.5H19a2 2 0 0 1 2 2v7.7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z" />
    </>
  ),
  cloud: (
    <path d="M7 18h9.4a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.6-1.2A3.9 3.9 0 0 0 7 18z" />
  ),
  cloudnet: (
    <>
      <path d="M7 15.5h9.4a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.6-1.2A3.9 3.9 0 0 0 7 15.5z" />
      <path d="M12 17.4v4M10 19.4l2 2 2-2" />
    </>
  ),
  lyric: (
    <>
      <circle cx="6.8" cy="17.4" r="2.4" />
      <circle cx="17.2" cy="15.4" r="2.4" />
      <path d="M9.2 17.4V6.6l10.4-2v10.8" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="10" rx="3" />
      <path d="M5.6 11a6.4 6.4 0 0 0 12.8 0M12 17.4V21" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m10.2 9.6 5.2 2.4-5.2 2.4z" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.6" cy="10" r="1.6" />
      <path d="m4 17.2 5-4.6 4 3.6 3-2.6 4 3.6" />
    </>
  ),
  list: <path d="M4 7h16M4 12h16M4 17h10" />,
  heart: <path d="M12 20.2S4.8 15.6 4.8 10.9A4 4 0 0 1 12 8.3a4 4 0 0 1 7.2 2.6c0 4.7-7.2 9.3-7.2 9.3z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3v2.4M12 18.6V21M4.4 7.6l2 1.2M17.6 15.2l2 1.2M4.4 16.4l2-1.2M17.6 8.8l2-1.2" />
    </>
  ),
  tv: (
    <>
      <rect x="2.5" y="6.6" width="19" height="12" rx="2.5" />
      <path d="m8.6 3.4 3.4 3.2 3.4-3.2" />
    </>
  ),
  remote: (
    <>
      <rect x="8" y="2.5" width="8" height="19" rx="3" />
      <path d="M10.6 6.6h2.8M12 10.6v3.2" />
    </>
  ),
  devices: (
    <>
      <rect x="2.5" y="5" width="13" height="10" rx="2" />
      <path d="M6 18.6h7" />
      <rect x="17" y="8.6" width="4.6" height="9.4" rx="1.4" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
      <path d="M10.8 18.6h2.4" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10.2 8.4 6 3.6-6 3.6z" />
    </>
  ),
  pause: (
    <>
      <rect x="7" y="5" width="3.6" height="14" rx="1.3" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1.3" />
    </>
  ),
  prev: (
    <>
      <path d="M18.5 5.5v13" />
      <path d="M15 12 5.5 6.4v11.2z" />
    </>
  ),
  next: (
    <>
      <path d="M5.5 5.5v13" />
      <path d="M9 12l9.5-5.6v11.2z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.4" />
      <path d="m15.8 15.8 4.6 4.6" />
    </>
  ),
  /* ---- 交互 / 通用 ---- */
  download: (
    <>
      <path d="M12 3.6v10.8" />
      <path d="m7.6 10 4.4 4.4L16.4 10" />
      <path d="M4.6 19.8h14.8" />
    </>
  ),
  rocket: (
    <>
      <path d="M14.2 4.4c3.4 0 5.8 2.4 5.8 5.8 0 4-4.3 7.4-7.8 8.9-1.2-1.8-4-3.4-6-4.1 1.4-3.5 3.9-10.6 8-10.6z" />
      <circle cx="14.8" cy="9.4" r="1.6" />
    </>
  ),
  code: <path d="m9 8-4.6 4L9 16M15 8l4.6 4L15 16" />,
  arrowRight: <path d="M4.5 12h13M12.8 6.6 18.4 12l-5.6 5.4" />,
  spark: <path d="M12 3.6 13.9 9 19.4 12l-5.5 3L12 20.4 10.1 15 4.6 12 10.1 9z" />,
  check: <path d="m5 12.6 4.6 4.6L19 7.4" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" />,
};

export type TvIconName = keyof typeof PATHS | string;

interface TvIconProps {
  /** 图标名（见 PATHS），未命中时回退到 spark */
  name: TvIconName;
  /** 尺寸（px），默认 24 */
  size?: number;
  /** 线宽，默认 1.7（大屏可读性） */
  strokeWidth?: number;
  /** 无障碍标题：传入后变为语义图标（role="img" + aria-label），不传则纯装饰 */
  title?: string;
  className?: string;
}

/** 内联 SVG 图标：线性风格，颜色继承 currentColor */
export function TvIcon({ name, size = 24, strokeWidth = 1.7, title, className }: TvIconProps) {
  const node = PATHS[name] ?? PATHS.spark;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {node}
    </svg>
  );
}

export default TvIcon;
