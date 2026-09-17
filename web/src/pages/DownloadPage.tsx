import {
  AndroidOutlined,
  AppleOutlined,
  CloudDownloadOutlined,
  DownloadOutlined,
  GithubOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import { faqs, site } from "../data/site";

const archs = [
  {
    name: "ARM64 (arm64-v8a)",
    desc: "绝大多数智能电视、电视盒子与近几年的手机，优先选择该版本。",
  },
  {
    name: "ARMv7 (armeabi-v7a)",
    desc: "较早的老电视 / 老盒子与低配置设备使用（部分设备可能无法播放高码率音频）。",
  },
  {
    name: "x86_64",
    desc: "用于 Android 模拟器或 x86 架构平板，实体电视一般不需要。",
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
            <span className="gradient-text"> · 一个 APK 通吃三种架构</span>
          </h1>
          <p className="section-desc">
            从 GitHub Releases 下载对应架构的 APK，安装到电视或手机即可使用。电视端建议用 U 盘 / adb
            安装，手机端直接点击安装包。
          </p>
          <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href={site.releases} target="_blank" rel="noreferrer" className="cta-primary">
              <CloudDownloadOutlined /> 前往 GitHub Releases
            </a>
            <a href={site.repo} target="_blank" rel="noreferrer" className="cta-ghost">
              <GithubOutlined /> 在 GitHub 查看项目
            </a>
          </div>
          <p className="hero-note">
            当前协议：{site.license} · 安装包来自 GitHub 官方 Release，请勿从第三方渠道下载。
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">选择对应架构</h2>
            <p className="section-desc">
              不确定架构时优先尝试 ARM64。安装后如无法启动，再换另一个版本。
            </p>
          </div>
          <div className="arch-list">
            {archs.map((a) => (
              <div className="arch-card" key={a.name}>
                <div className="arch-name">{a.name}</div>
                <div className="arch-desc">{a.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-3" style={{ marginTop: 26 }}>
            <div className="card">
              <div className="card-icon">
                <AndroidOutlined />
              </div>
              <div className="card-title">电视 / 盒子</div>
              <div className="card-desc">
                下载 APK 拷入 U 盘插入电视安装；或开启开发者调试后用{" "}
                <code className="inline">adb install</code> 推送，也可用电视助手类工具安装。
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <AppleOutlined />
              </div>
              <div className="card-title">手机 / 平板</div>
              <div className="card-desc">
                直接下载 APK 点击安装，首次启动按提示加入电池优化白名单，保证后台播放稳定。
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <LaptopOutlined />
              </div>
              <div className="card-title">模拟器 / 调试</div>
              <div className="card-desc">
                选择 x86_64 版本安装到模拟器，可配合 <code className="inline">adb</code> 命令调试。
              </div>
            </div>
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
