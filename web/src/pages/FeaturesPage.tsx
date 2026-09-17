import { Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { featureModules, site } from "../data/site";

export default function FeaturesPage() {
  return (
    <>
      <section className="download-hero">
        <div className="container">
          <span className="section-eyebrow">Features</span>
          <h1 className="section-title">
            全部功能特性
            <span className="gradient-text"> · {featureModules.length} 大模块</span>
          </h1>
          <p className="section-desc">
            从 NAS 后端接入、本地扫描、网络与网盘音乐，到歌词系统、播放控制、TV 遥控与手机触屏体验，
            每个模块都按大屏与遥控器场景实际打磨。
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Android TV", "手机", "平板", "开源 GPL v3"].map((t) => (
              <span className="pill" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="features-layout">
            <aside className="anchor-nav">
              {featureModules.map((m) => (
                <a key={m.key} href={`#${m.key}`}>
                  {m.title}
                </a>
              ))}
            </aside>

            <div>
              {featureModules.map((m) => (
                <div className="module-block" id={m.key} key={m.key}>
                  <div className="module-block-head">
                    <span className="card-icon" style={{ margin: 0 }}>
                      {m.icon}
                    </span>
                    <div>
                      <div className="module-block-title">{m.title}</div>
                      <div className="card-summary" style={{ margin: "4px 0 0" }}>
                        {m.summary}
                      </div>
                    </div>
                  </div>
                  <ul className="check-list" style={{ marginTop: 14 }}>
                    {m.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="cta-band" style={{ marginTop: 8 }}>
                <h3>功能都看完了？直接装上试试</h3>
                <p>电视 / 手机 / 平板共用同一 APK，安装后即可连接 NAS 或直接听网络音乐。</p>
                <div className="cta-band-actions">
                  <Link to="/download" className="cta-primary">
                    <DownloadOutlined /> 前往下载
                  </Link>
                  <a href={site.repo} target="_blank" rel="noreferrer" className="cta-ghost">
                    查看源码
                  </a>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <Tag color="purple">提示</Tag>
                <span style={{ fontSize: 13, color: "#98a2bf" }}>
                  部分功能依赖第三方服务或密钥（天气 API Key、网络音乐端点、Jamendo Client ID、百度网盘授权），
                  在设置页配置后生效。
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
