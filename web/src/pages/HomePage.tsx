/**
 * 首页 · NAS Music TV 产品介绍页
 *
 * 【美化要点 · 整体设计方向】
 * 深色沉浸 + 电视大屏质感 + 音乐播放器氛围（按「3 米观看距离」定尺寸与对比度）：
 *   Hero（100vh 全屏 + 封面模糊光晕 + 浮动光点粒子 + 电视外框主视觉）
 *   → 统计（JetBrains Mono 等宽大字）
 *   → Highlights（4 列卡片网格，图标 + 短标题 + 一句话）
 *   → Features（15 个模块，3 列卡片瀑布流，图标 + 标题 + 两行描述）
 *   → Screens（6 个 16:9 CSS 绘制的 TV 界面 mockup + 一行核心交互说明）
 *   → 底部 CTA（大号文案 + 青绿下载按钮居中）
 *
 * 【美化要点 · 功能与语义不变】
 * 所有下载 / GitHub 链接、react-router 路由跳转、文案内容均与原页面保持一致，
 * 仅替换视觉表现层；界面预览在 mockup 与实机截图之间可一键切换（原有截图能力保留）。
 *
 * 【美化要点 · 交互与性能】
 * - 卡片 hover / focus：translateY(-4px) + 青绿描边 + 阴影增强，过渡 0.25s ease
 * - 滚动渐入：Intersection Observer 触发 opacity 0→1 + translateY(20px)→0
 * - 粒子与光晕只使用 transform / opacity 做动画（合成层属性，will-change 见 CSS），不触发布局重排
 * - 图标全部为内联 SVG，mockup 全部为 CSS 绘制，页面不新增任何第三方库与图片请求
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { site, stats, highlights, featureModules, screens } from "../data/site";
import { useScreenshots } from "../hooks/useScreenshots";
import { heroShot, screenShots } from "../data/screenshots";
import { TvIcon } from "../components/TvIcons";
import "../styles/home.css";

/* --------------------------------------------------------------------------
 * 1. 滚动渐入：Intersection Observer（用户关闭动效时直接显示，不做任何动画）
 * -------------------------------------------------------------------------- */
function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".tv-reveal"));
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

/* --------------------------------------------------------------------------
 * 2. 数据映射：图标 / mockup / 核心交互提示
 * -------------------------------------------------------------------------- */
/** 6 个核心卖点 → 内联 SVG 图标名 */
const HIGHLIGHT_ICONS: Record<string, string> = {
  "multi-source": "server",
  "karaoke-lyric": "lyric",
  karaoke: "mic",
  mtv: "video",
  "weather-radio": "cloud",
  "dual-device": "devices",
};

/** 15 个功能模块 → 内联 SVG 图标名 */
const FEATURE_ICONS: Record<string, string> = {
  dashboard: "home",
  nas: "server",
  local: "folder",
  online: "globe",
  discover: "compass",
  weather: "cloud",
  baidu: "cloudnet",
  lyric: "lyric",
  playback: "play",
  cover: "image",
  library: "list",
  mine: "heart",
  settings: "settings",
  tv: "tv",
  mobile: "phone",
};

/** 界面 → CSS mockup 类型（前 6 个界面均为 TV 端核心界面） */
type MockKind = "dashboard" | "player" | "karaoke" | "mtv" | "visualizer" | "library";

const SCREEN_MOCKS: Record<string, MockKind> = {
  首页仪表盘: "dashboard",
  播放页: "player",
  "K 歌页": "karaoke",
  "MTV 播放页": "mtv",
  可视化舞台: "visualizer",
  曲库页: "library",
};

/** 界面 → 一行「核心交互」说明（呼应遥控器 D-Pad 操作） */
const SCREEN_HINTS: Record<string, string> = {
  首页仪表盘: "遥控器上下移动焦点，OK 打开播放器",
  播放页: "左右键切歌，OK 播放 / 暂停",
  "K 歌页": "遥控器左右切换原唱 / 伴奏",
  "MTV 播放页": "OK 切换歌词，左右键换一首 MV",
  可视化舞台: "左右键即时切换 20+ 套特效",
  曲库页: "左右移动切换 Tab，OK 选中",
};

/** Hero 浮动光点粒子（低性能消耗：纯 CSS transform 动画） */
const PARTICLES: Array<{
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  purple?: boolean;
}> = [
  { left: "6%", top: "24%", size: 6, delay: "0s", duration: "19s" },
  { left: "16%", top: "68%", size: 4, delay: "2.4s", duration: "23s", purple: true },
  { left: "28%", top: "14%", size: 5, delay: "4.1s", duration: "21s" },
  { left: "38%", top: "80%", size: 7, delay: "1.2s", duration: "26s", purple: true },
  { left: "52%", top: "12%", size: 4, delay: "5.6s", duration: "22s" },
  { left: "62%", top: "72%", size: 6, delay: "3.3s", duration: "24s" },
  { left: "74%", top: "30%", size: 5, delay: "6.4s", duration: "20s", purple: true },
  { left: "84%", top: "62%", size: 4, delay: "2.1s", duration: "25s" },
  { left: "91%", top: "20%", size: 6, delay: "7.2s", duration: "23s" },
  { left: "46%", top: "46%", size: 3, delay: "1.8s", duration: "18s" },
];

/** 音频波形示意条（mockup 内使用） */
const WAVE_BARS = [0.4, 0.75, 1, 0.55, 0.9, 0.35, 0.8, 0.6, 1, 0.45];

/* --------------------------------------------------------------------------
 * 3. TV 界面 mockup：全部由 CSS + 色块绘制（无图片请求），容器 aria-hidden
 * -------------------------------------------------------------------------- */
function TvMock({ kind }: { kind: MockKind }) {
  if (kind === "dashboard") {
    return (
      <div className="mk" aria-hidden="true">
        <div className="mk-dash-top">
          <span className="mk-pill on" />
          <span className="mk-pill" />
          <span className="mk-pill" />
          <span className="mk-pill" />
          <span className="mk-pill grow" />
        </div>
        <div className="mk-dash-hero">
          <div className="mk-cover" />
          <div className="mk-col">
            <span className="mk-line light" style={{ width: "72%" }} />
            <span className="mk-line dim" style={{ width: "46%" }} />
            <div className="mk-wave">
              {WAVE_BARS.map((h, i) => (
                <span key={i} style={{ height: `${h * 100}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="mk-tiles">
          <div className="mk-cover" />
          <div className="mk-cover v2" />
          <div className="mk-cover v3" />
          <div className="mk-cover v4" />
        </div>
      </div>
    );
  }

  if (kind === "player") {
    /* 参考 walkman-tv / ZL-Music TV：左旋转黑胶 + 右逐行滚动歌词 */
    return (
      <div className="mk mk-player" aria-hidden="true">
        <div className="mk-player-left">
          <div className="mk-vinyl" />
          <span className="mk-line light" style={{ width: "72%" }} />
        </div>
        <div className="mk-player-right">
          <span className="mk-line dim" style={{ width: "82%" }} />
          <span className="mk-lyric-active">当前句 · 平滑滚动</span>
          <span className="mk-ktext">逐字高亮 · 卡拉OK歌词</span>
          <span className="mk-line dim" style={{ width: "64%" }} />
          <div className="mk-progress">
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "karaoke") {
    return (
      <div className="mk mk-ktv" aria-hidden="true">
        <div className="mk-col" style={{ flex: "0 0 auto", alignItems: "center", gap: 8 }}>
          <span className="mk-line light" style={{ width: "30%" }} />
          <span className="mk-line dim" style={{ width: "18%" }} />
        </div>
        <div className="mk-glass">
          <span className="mk-line dim" style={{ width: "74%" }} />
          <span className="mk-ktext">逐字高亮 · 卡拉OK</span>
        </div>
        <div className="mk-ktv-bar">
          <span className="mk-btn" />
          <span className="mk-btn big" />
          <span className="mk-btn" />
        </div>
      </div>
    );
  }

  if (kind === "mtv") {
    return (
      <div className="mk mk-mtv" aria-hidden="true">
        <div className="mk-video" />
        <div className="mk-mtv-center">
          <div className="mk-mtv-name">MV · MTV</div>
          <span className="mk-ktext">全屏音乐视频 · 逐字歌词</span>
        </div>
        <div className="mk-mtv-bar">
          <span className="mk-btn" />
          <span className="mk-btn big" />
          <span className="mk-btn" />
        </div>
        <div className="mk-progress" style={{ margin: "0 6% 5%" }}>
          <span />
        </div>
      </div>
    );
  }

  if (kind === "visualizer") {
    return (
      <div className="mk mk-viz" aria-hidden="true">
        <div className="mk-viz-bg" />
        <div className="mk-viz-particles" />
        <div className="mk-viz-top">
          <span className="mk-lyric-pill">顶部胶囊歌词 · 当前句</span>
        </div>
        <div className="mk-viz-bottom">
          <div className="mk-col" style={{ gap: 8, maxWidth: "46%" }}>
            <span className="mk-line light" style={{ width: "60%" }} />
            <span className="mk-line dim" style={{ width: "42%" }} />
          </div>
          <div className="mk-viz-dots">
            <span className="mk-dot on" />
            <span className="mk-dot" />
            <span className="mk-dot" />
            <span className="mk-dot" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mk mk-lib" aria-hidden="true">
      <div className="mk-lib-head">
        <span className="mk-lib-title">曲库</span>
        <div className="mk-lib-tabs">
          <span className="mk-pill" />
          <span className="mk-pill on" />
          <span className="mk-pill" />
          <span className="mk-pill" />
          <span className="mk-pill" />
        </div>
      </div>
      <div className="mk-lib-body">
        <div className="mk-lib-grid">
          <div className="mk-cover" />
          <div className="mk-cover v2" />
          <div className="mk-cover v3" />
          <div className="mk-cover v4" />
          <div className="mk-cover v2" />
          <div className="mk-cover v4" />
          <div className="mk-cover" />
          <div className="mk-cover v3" />
        </div>
        <div className="mk-index">
          {["", "on", "", "", "", "", "", ""].map((c, i) => (
            <i key={i} className={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * 4. 界面预览卡片：默认展示 CSS mockup，可一键切换实机截图
 * -------------------------------------------------------------------------- */
function ScreenCard({
  name,
  tag,
  desc,
  hint,
  kind,
  shotSrc,
  delay,
}: {
  name: string;
  tag: string;
  desc: string;
  hint: string;
  kind: MockKind;
  shotSrc: string | null;
  delay: number;
}) {
  const [showShot, setShowShot] = useState(false);
  const shot = showShot && shotSrc ? shotSrc : null;

  return (
    <article
      className="tv-screen-card tv-reveal"
      style={{ transitionDelay: `${delay}ms` }}
      tabIndex={0}
      aria-label={`${name}界面预览`}
    >
      <div className="tv-screen-frame">
        <div className="tv-screen-16x9">
          {shot ? (
            <img src={shot} alt={`${name} 电视端实机界面截图`} loading="lazy" decoding="async" />
          ) : (
            <TvMock kind={kind} />
          )}
        </div>
        {shotSrc ? (
          <button
            type="button"
            className="tv-screen-toggle"
            onClick={() => setShowShot((v) => !v)}
            aria-pressed={showShot}
            aria-label={`${name}：切换模拟图 / 实机截图`}
          >
            {showShot ? "模拟图" : "实机截图"}
          </button>
        ) : null}
      </div>

      <div className="tv-screen-body">
        <h3 className="tv-screen-name">
          {name}
          <span className="tv-tag">{tag}</span>
        </h3>
        <p className="tv-screen-desc" title={desc}>
          {desc}
        </p>
        {/* 一行小字：该界面的核心交互 */}
        <p className="tv-screen-hint">
          <TvIcon name="remote" size={16} />
          {hint}
        </p>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
 * 5. 页面
 * -------------------------------------------------------------------------- */
export default function HomePage() {
  const { firstOf } = useScreenshots();
  useRevealOnScroll();

  /** 主视觉：优先复用首页仪表盘等实机截图，缺失时退回 CSS 绘制的播放页 mockup */
  const heroFile = useMemo(
    () => firstOf(heroShot.file, ...(heroShot.fallbackFiles ?? [])),
    [firstOf]
  );

  /** 首屏 6 个核心界面（均为 TV 端主界面） */
  const topScreens = screens.slice(0, 6);

  return (
    <div className="tv-home">
      {/* ================= Hero：100vh 全屏 + 模糊光晕 + 浮动光点粒子 ================ */}
      <section className="tv-hero" aria-labelledby="tv-hero-title">
        <div className="tv-hero-glow" aria-hidden="true" />
        <div className="tv-grid-texture" aria-hidden="true" />
        <div className="tv-particles" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={`tv-particle${p.purple ? " is-purple" : ""}`}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        <div className="container">
          <div className="tv-hero-title-full">
            <div className="tv-badges">
              <span className="tv-pill is-brand">
                <TvIcon name="spark" size={14} />
                Android 开源应用
              </span>
              <span className="tv-pill">{site.license}</span>
              {site.devices.map((d) => (
                <span className="tv-pill" key={d}>
                  {d}
                </span>
              ))}
            </div>

            <div className="tv-hero-brand">{site.name}</div>
            <h1 id="tv-hero-title" className="tv-hero-title">
              把 NAS 曲库、网盘与网络音乐搬进客厅大屏
            </h1>
          </div>

          <div className="tv-hero-inner">
            <div>
              <p className="tv-hero-lead">{site.tagline}</p>
              <p className="tv-hero-sub">{site.subtitle}</p>

              <div className="tv-hero-actions">
                <a
                  href={site.releases}
                  target="_blank"
                  rel="noreferrer"
                  className="tv-btn tv-btn-primary"
                >
                  <TvIcon name="download" size={20} />
                  下载最新 APK
                </a>
                <Link to="/features" className="tv-btn tv-btn-ghost">
                  <TvIcon name="rocket" size={20} />
                  看看能做什么
                </Link>
                <a
                  href={site.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="tv-btn tv-btn-ghost"
                >
                  <TvIcon name="code" size={20} />
                  GitHub 源码
                </a>
              </div>

              <p className="tv-hero-note">
                电视、手机、平板共用同一 APK：电视走遥控器焦点体系，手机走触屏与 MiniPlayer。
              </p>
            </div>

            {/* 主视觉：16:9 电视外框 + 屏幕呼吸发光 */}
            <div className="tv-hero-screen tv-reveal">
              <div className="tv-frame tv-breathe">
                <div className="tv-frame-inner">
                  {heroFile ? (
                    <img
                      className="tv-frame-img"
                      src={heroFile}
                      alt="NAS Music TV 首页仪表盘界面预览"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <TvMock kind="player" />
                  )}
                </div>
              </div>
              <div className="tv-stand" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 统计数字：等宽大字 ================= */}
      <section className="tv-section">
        <div className="container">
          <div className="tv-stats">
            {stats.map((s, i) => (
              <div
                className="tv-stat tv-reveal"
                key={s.label}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="tv-stat-value">{s.value}</div>
                <div className="tv-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Highlights：4 列卡片网格 ================= */}
      <section className="tv-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="tv-home-head tv-reveal">
            <span className="tv-eyebrow">Highlights</span>
            <h2 className="tv-h2">客厅 K 歌房，也是全屋音乐中枢</h2>
            <p className="tv-lead">
              从多源聚合曲库，到逐字卡拉OK歌词、实时人声消除、B 站 MV 与天气电台，
              NAS Music TV 把电视端缺失的音乐体验一次性补齐。
            </p>
          </div>

          <div className="tv-grid tv-grid-4">
            {highlights.map((h, i) => (
              <div
                className="tv-card tv-reveal"
                key={h.key}
                style={{ transitionDelay: `${(i % 4) * 80}ms` }}
                tabIndex={0}
              >
                <div className="tv-card-icon">
                  <TvIcon name={HIGHLIGHT_ICONS[h.key] ?? "spark"} size={28} />
                </div>
                <h3 className="tv-card-title">{h.title}</h3>
                <p className="tv-card-desc" title={h.desc}>
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Features：15 个模块，3 列卡片瀑布流 ================= */}
      <section className="tv-section tv-features" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="tv-home-head tv-reveal">
            <span className="tv-eyebrow">Features</span>
            <h2 className="tv-h2">
              覆盖曲库、歌词、播放与双端交互的
              <span className="tv-accent">完整能力</span>
            </h2>
            <p className="tv-lead">
              共 {featureModules.length} 大功能模块，从连接 NAS 后端到本地扫描、网盘串流与可视化舞台，
              开箱即用，无需折腾。
            </p>
          </div>

          <div className="tv-feature-grid">
            {featureModules.map((m, i) => (
              <div
                className="tv-feature tv-reveal"
                key={m.key}
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
                tabIndex={0}
              >
                <div className="tv-feature-icon">
                  <TvIcon name={FEATURE_ICONS[m.key] ?? "spark"} size={24} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 className="tv-feature-title">{m.title}</h3>
                  <p
                    className="tv-feature-desc"
                    title={m.items.length ? m.items.join("；") : m.summary}
                  >
                    {m.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="tv-more tv-reveal">
            <Link to="/features" className="tv-btn tv-btn-ghost">
              查看全部 {featureModules.length} 个功能模块
              <TvIcon name="arrowRight" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Screens：16:9 TV 界面 mockup ================= */}
      <section className="tv-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="tv-home-head tv-reveal">
            <span className="tv-eyebrow">Screens</span>
            <h2 className="tv-h2">为遥控器和大屏重新设计的界面</h2>
            <p className="tv-lead">
              完整的 D-Pad 焦点系统、10 秒轮播的多封面、可调高斯模糊滤镜与可视化频谱，全部按电视使用场景打磨。
            </p>
          </div>

          <div className="tv-screens">
            {topScreens.map((s, i) => {
              const shot = screenShots[s.name];
              const shotSrc = shot
                ? firstOf(shot.file, ...(shot.fallbackFiles ?? []))
                : null;
              return (
                <ScreenCard
                  key={s.name}
                  name={s.name}
                  tag={s.tag}
                  desc={s.desc}
                  hint={SCREEN_HINTS[s.name] ?? "遥控器左右切换，OK 选中"}
                  kind={SCREEN_MOCKS[s.name] ?? "dashboard"}
                  shotSrc={shotSrc}
                  delay={(i % 2) * 90}
                />
              );
            })}
          </div>

          <p className="tv-hero-note tv-reveal" style={{ marginTop: 28 }}>
            以上为电视端实机界面；完整 {screens.length} 个界面见{" "}
            <Link to="/screens" style={{ color: "var(--tv-brand)" }}>
              界面预览
            </Link>
            。
          </p>

          <div className="tv-more tv-reveal" style={{ marginTop: 24 }}>
            <Link to="/screens" className="tv-btn tv-btn-ghost">
              浏览全部 {screens.length} 个界面
              <TvIcon name="arrowRight" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 底部 CTA：大号文案 + 青绿下载按钮居中 ================= */}
      <section className="tv-cta">
        <div className="tv-cta-glow" aria-hidden="true" />
        <div className="container">
          <h2 className="tv-cta-title tv-reveal">把 NAS 曲库搬上大屏</h2>
          <p className="tv-cta-desc tv-reveal">
            开源、免注册、无广告。下载 APK 装上电视，扫码即可用手机遥控队列与点歌。
          </p>
          <div className="tv-cta-actions tv-reveal">
            <a
              href={site.releases}
              target="_blank"
              rel="noreferrer"
              className="tv-btn tv-btn-primary"
            >
              <TvIcon name="download" size={20} />
              下载最新版
            </a>
            <a href={site.repo} target="_blank" rel="noreferrer" className="tv-btn tv-btn-ghost">
              <TvIcon name="code" size={20} />
              参与开源
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
