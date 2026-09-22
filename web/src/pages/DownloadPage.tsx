import {
  CheckCircleOutlined,
  DownloadOutlined,
  GithubOutlined,
  LaptopOutlined,
  MobileOutlined,
  TabletOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import {
  APK_DOWNLOAD_URL,
  APK_FILE_NAME,
  APK_RELEASES_LATEST,
  APK_VERSION,
  faqs,
  site,
} from "../data/site";

/** 通用 APK 内置的三种 ABI：安装时由系统自动取用，用户无需挑选 */
const abis = [
  {
    name: "ARM64 (arm64-v8a)",
    desc: "绝大多数智能电视、电视盒子与近几年的手机，性能与兼容性最佳。",
  },
  {
    name: "ARMv7 (armeabi-v7a)",
    desc: "面向较早的老电视 / 老盒子与低配置设备，同一安装包自动适配。",
  },
  {
    name: "x86_64",
    desc: "用于 Android 模拟器或 x86 架构平板，实体电视一般不会用到。",
  },
];

/** 同一通用 APK 覆盖的所有设备形态与对应安装方式 */
const devices = [
  {
    icon: <MobileOutlined />,
    title: "手机",
    desc: "直接下载 APK 点击安装；首次启动按提示加入电池优化白名单，保证后台播放稳定。",
  },
  {
    icon: <TabletOutlined />,
    title: "平板",
    desc: "与手机同一个安装包，触屏交互与曲库网格随屏幕宽度自适应，横竖屏都好用。",
  },
  {
    icon: <DesktopOutlined />,
    title: "电视 / 盒子",
    desc: (
      <>
        把 APK 拷入 U 盘插入电视安装；或开启开发者调试后用{" "}
        <code className="inline">adb install</code>{" "}
        推送，也可用电视助手类工具安装，遥控器焦点体系开箱即用。
      </>
    ),
  },
  {
    icon: <LaptopOutlined />,
    title: "模拟器 / 调试",
    desc: (
      <>
        直接安装同一个 APK 到 Android 模拟器，可配合 <code className="inline">adb</code>{" "}
        命令安装与调试。
      </>
    ),
  },
];

export default function DownloadPage() {
  return (
    <>
      <section className="download-hero">
        <div className="container">
          <span className="section-eyebrow">Download</span>
          <h1 className="section-title">
            下载与安装
            <span className="gradient-text"> · 一个 APK 通吃所有设备</span>
          </h1>
          <p className="section-desc">
            官网提供最新版 APK 直链下载：手机 / 平板点击即可安装，电视端建议用 U 盘 / adb
            安装。同一个安装包内置三种架构并自动适配设备，无需再挑架构、挑版本。
          </p>
          <div className="hero-badges" style={{ marginTop: 24 }}>
            <span className="pill pill-strong">最新版本 {APK_VERSION}</span>
            <span className="pill">通用 APK · 内置 ARM64 / ARMv7 / x86_64</span>
            <span className="pill">手机 · 平板 · 电视 · 模拟器</span>
          </div>
          <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href={APK_DOWNLOAD_URL} download className="cta-primary">
              <DownloadOutlined /> 直接下载最新 APK（{APK_VERSION}）
            </a>
            <a href={APK_RELEASES_LATEST} target="_blank" rel="noreferrer" className="cta-ghost">
              <GithubOutlined /> GitHub Releases
            </a>
          </div>
          <p className="hero-note">
            当前协议：{site.license} · 安装包同时发布在 GitHub 官方 Release，请勿从第三方渠道下载。
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="apk-panel">
            <div className="apk-meta">
              <span className="pill pill-strong">Latest · {APK_VERSION}</span>
              <div className="apk-filename">{APK_FILE_NAME}</div>
              <div className="apk-tags">
                <span className="pill">通用安装包 · 全架构合一</span>
                <span className="pill">覆盖安装，播放数据自动保留</span>
              </div>
              {__APP_CHANGELOG_LATEST__.sections.length > 0 && (
                <div className="apk-changelog">
                  <div className="apk-changelog-title">
                    {__APP_CHANGELOG_LATEST__.version} 更新内容
                    {__APP_CHANGELOG_LATEST__.date && (
                      <span className="apk-changelog-date">{__APP_CHANGELOG_LATEST__.date}</span>
                    )}
                  </div>
                  {__APP_CHANGELOG_LATEST__.summary && (
                    <div className="apk-changelog-summary">{__APP_CHANGELOG_LATEST__.summary}</div>
                  )}
                  {__APP_CHANGELOG_LATEST__.sections.map((sec) => (
                    <div className="apk-changelog-section" key={sec.label}>
                      <span className="apk-changelog-label">{sec.label}</span>
                      <ul>
                        {sec.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="apk-actions">
              <a href={APK_DOWNLOAD_URL} download className="cta-primary">
                <DownloadOutlined /> 直接下载
              </a>
              <a href={APK_RELEASES_LATEST} target="_blank" rel="noreferrer" className="cta-ghost">
                <GithubOutlined /> 到 GitHub 查看该版本
              </a>
              <span className="apk-action-note">
                新版本发布后，本页直链与文件名随版本号同步更新
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">一个 APK，全设备适配</h2>
            <p className="section-desc">
              手机、平板、电视、盒子与模拟器装的是同一个安装包：运行时自动识别设备类型，电视走遥控器焦点体系，手机走触屏与
              MiniPlayer，互不影响。
            </p>
          </div>
          <div className="grid grid-4">
            {devices.map((d) => (
              <div className="card" key={d.title}>
                <div className="card-icon">{d.icon}</div>
                <div className="card-title">{d.title}</div>
                <div className="card-desc">{d.desc}</div>
              </div>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: 36 }}>
            <h3 className="section-title" style={{ fontSize: 20 }}>
              安装包内置三种架构，安装时自动适配
            </h3>
            <p className="section-desc">
              通用 APK 已包含以下三种 ABI，正常情况无需关注架构差异，直接安装即可。
            </p>
          </div>
          <div className="arch-list">
            {abis.map((a) => (
              <div className="arch-card" key={a.name}>
                <div className="arch-name">
                  <CheckCircleOutlined className="arch-check" />
                  {a.name}
                  <span className="arch-tag">已内置</span>
                </div>
                <div className="arch-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title">常见问题</h2>
            <p className="section-desc">
              安装、音乐源与播放相关的常见疑问都在这里；还有问题可以到 GitHub 提 Issue。
            </p>
          </div>

          {faqs.map((f) => (
            <div className="faq-item" key={f.q}>
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h3>装好了？接着配置你的音乐源</h3>
            <p>
              连接 Jellyfin / Navidrome / Subsonic / 道理鱼 / 飞牛，或直接在设置页配置网络音乐端点与百度网盘授权。
            </p>
            <div className="cta-band-actions">
              <a href={site.repo} target="_blank" rel="noreferrer" className="cta-primary">
                <DownloadOutlined /> 查看使用文档
              </a>
              <a href={`${site.repo}/issues`} target="_blank" rel="noreferrer" className="cta-ghost">
                遇到问题？提 Issue
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
