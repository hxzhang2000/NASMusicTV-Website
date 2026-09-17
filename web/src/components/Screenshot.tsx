import { useState } from "react";
import { PictureOutlined } from "@ant-design/icons";
import { useScreenshots } from "../hooks/useScreenshots";

interface ScreenshotProps {
  /** 期望的文件名 */
  file: string;
  /** 建议尺寸说明 */
  spec: string;
  /** 拍摄 / 内容要点 */
  note?: string;
  /** 可选：手机端版本文件名 */
  mobileFile?: string;
  mobileSpec?: string;
  /** 可选：主文件缺失时的备用图（按顺序取第一个存在的） */
  fallbackFiles?: string[];
  /** 可选：竖屏截图位（如手机遥控页）—— 使用 9:16 框并按手机比例展示 */
  portrait?: boolean;
  /** 无障碍描述 */
  alt: string;
  /** 紧凑模式（首页卡片） */
  compact?: boolean;
  /** 额外 class */
  className?: string;
}

/**
 * 截图位组件：图片已放入 public/screens/ 则直接展示；
 * 图片缺失时展示同尺寸的空帧（不显示任何文件路径等内部信息）。
 * 若配置了 fallbackFiles，主图缺失时会自动改用备选图。
 */
export default function Screenshot({
  file,
  spec,
  mobileFile,
  mobileSpec,
  fallbackFiles,
  portrait = false,
  alt,
  className = "",
}: ScreenshotProps) {
  const { has, firstOf } = useScreenshots();
  const [view, setView] = useState<"tv" | "mobile">("tv");

  const hasMobile = has(mobileFile);
  const mobile = view === "mobile" && hasMobile;
  const wantedFile = mobile && mobileFile ? mobileFile : file;
  const wantedSpec = mobile && mobileSpec ? mobileSpec : spec;
  /** 实际渲染的地址：优先期望文件，其次备用图（已是可直接使用的 src，本地文件或图床外链均可） */
  const activeFile = firstOf(wantedFile, ...(fallbackFiles ?? []));

  return (
    <div
      className={`screen-thumb ${mobile ? "is-mobile" : ""} ${
        portrait ? "is-portrait" : ""
      } ${className}`.trim()}
    >
      {activeFile ? (
        <img
          className="shot-img"
          src={activeFile}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="shot-placeholder" title={`${wantedFile} · ${wantedSpec}`}>
          <PictureOutlined className="shot-icon" />
          <div className="shot-title">{alt}</div>
        </div>
      )}

      {hasMobile ? (
        <div className="shot-switch">
          <button
            type="button"
            className={view === "tv" ? "on" : ""}
            onClick={() => setView("tv")}
          >
            TV
          </button>
          <button
            type="button"
            className={view === "mobile" ? "on" : ""}
            onClick={() => setView("mobile")}
          >
            手机
          </button>
        </div>
      ) : null}
    </div>
  );
}
