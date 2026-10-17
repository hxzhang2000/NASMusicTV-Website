import { useEffect, useRef, useState } from "react";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { effects, effectSrc } from "../data/effects";

/**
 * 特效图集页：可视化舞台的画面快照网格 + 灯箱大图浏览。
 *
 * 灯箱为纯 React 状态实现（无第三方库）：
 *   - 点击卡片或按 Enter 打开，Esc 关闭，← / → 或两侧按钮切换（首尾循环）
 *   - 打开时锁定页面滚动并把焦点移到关闭按钮，关闭后焦点回到触发卡片
 *   - 图片加载失败时降级为占位框（显示效果名），不出现破图
 */
export default function EffectsPage() {
  /** 加载失败的截图（枚举名 → true），网格与灯箱共用同一份降级状态 */
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  /** 灯箱当前下标；null 表示未打开 */
  const [openAt, setOpenAt] = useState<number | null>(null);
  /** 打开灯箱的触发元素，关闭后把焦点还回去 */
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = openAt !== null;

  const markFailed = (enumName: string) =>
    setFailed((prev) => (prev[enumName] ? prev : { ...prev, [enumName]: true }));

  const step = (delta: number) =>
    setOpenAt((i) =>
      i === null ? i : (i + delta + effects.length) % effects.length
    );

  /* 键盘：Esc 关闭，左右方向键切换（打开期间生效） */
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenAt(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  /* 打开期间锁定页面滚动、焦点移到关闭按钮；关闭时恢复滚动并把焦点还给触发卡片 */
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const openFrom = (index: number, el: HTMLElement) => {
    triggerRef.current = el;
    setOpenAt(index);
  };

  const current = openAt === null ? null : effects[openAt];

  return (
    <>
      <section className="download-hero">
        <div className="container">
          <span className="section-eyebrow">Effects</span>
          <h1 className="section-title">
            特效图集
            <span className="gradient-text"> · {effects.length} 套画面快照</span>
          </h1>
          <p className="section-desc">
            可视化舞台在播放时铺满全屏，效果按设备性能分低 / 中 / 高三档画质，
            遥控器左右键即时切换。本页汇总各效果的画面快照，点击任意画面可放大浏览。
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["全屏舞台", "低 / 中 / 高三档画质", `${effects.length} 张快照`].map((t) => (
              <span className="pill" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="effects-grid">
            {effects.map((shot, idx) => (
              <button
                key={shot.enum}
                type="button"
                className="effect-card"
                aria-label={`放大查看：${shot.name}`}
                onClick={(e) => openFrom(idx, e.currentTarget)}
              >
                <span className="effect-frame">
                  {failed[shot.enum] ? (
                    <span className="shot-placeholder">
                      <span className="shot-title">{shot.name}</span>
                      <span className="shot-file">{shot.enum}.jpg</span>
                    </span>
                  ) : (
                    <img
                      src={effectSrc(shot)}
                      alt={`${shot.name} 可视化特效画面快照`}
                      loading="lazy"
                      decoding="async"
                      onError={() => markFailed(shot.enum)}
                    />
                  )}
                </span>
                <span className="effect-meta">
                  <span className="effect-name">{shot.name}</span>
                  <span className="effect-enum">{shot.enum}</span>
                </span>
              </button>
            ))}
          </div>

          <p className="card-summary" style={{ marginTop: 24 }}>
            以上为端上实拍画面快照，实际观感随画质档位与设备性能略有差异；
            快照持续补充中，数量以本页列出的为准。
          </p>

          <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/download" className="cta-primary">
              下载安装
            </Link>
            <Link to="/features" className="cta-ghost">
              查看完整功能清单
            </Link>
          </div>
        </div>
      </section>

      {openAt !== null && current && (
        <div
          className="effect-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.name} · 大图浏览`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenAt(null);
          }}
        >
          <div className="effect-lightbox-top">
            <div className="effect-lightbox-caption">
              <span className="effect-lightbox-name">{current.name}</span>
              <span className="effect-lightbox-enum">{current.enum}</span>
            </div>
            <span className="effect-counter">
              {openAt + 1} / {effects.length}
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              className="effect-icon-btn"
              aria-label="关闭大图"
              onClick={() => setOpenAt(null)}
            >
              <CloseOutlined />
            </button>
          </div>

          <div
            className="effect-lightbox-stage"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpenAt(null);
            }}
          >
            <button
              type="button"
              className="effect-icon-btn effect-nav"
              aria-label="上一张"
              onClick={() => step(-1)}
            >
              <LeftOutlined />
            </button>

            <figure className="effect-lightbox-figure">
              {failed[current.enum] ? (
                <span className="shot-placeholder" style={{ minHeight: 220 }}>
                  <span className="shot-title">{current.name}</span>
                  <span className="shot-file">{current.enum}.jpg</span>
                </span>
              ) : (
                <img
                  src={effectSrc(current)}
                  alt={`${current.name} 可视化特效画面`}
                  onError={() => markFailed(current.enum)}
                />
              )}
              <figcaption className="effect-lightbox-cap">
                <span>{current.name}</span>
                <span className="effect-lightbox-enum">{current.enum}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              className="effect-icon-btn effect-nav"
              aria-label="下一张"
              onClick={() => step(1)}
            >
              <RightOutlined />
            </button>
          </div>

          <p className="effect-lightbox-hint">Esc 关闭 · ← / → 切换上一张 / 下一张</p>
        </div>
      )}
    </>
  );
}
