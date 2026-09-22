import { Tag } from "antd";
import {
  ApiOutlined,
  CodeOutlined,
  CopyrightOutlined,
  DownloadOutlined,
  GithubOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { apiVersions, site, stats, APK_DOWNLOAD_URL, APK_VERSION } from "../data/site";
import { SITE_VERSION, SITE_BUILD_TIME } from "../version";

export default function AboutPage() {
  return (
    <>
      <section className="download-hero">
        <div className="container">
          <span className="section-eyebrow">About</span>
          <h1 className="section-title">
            关于 <span className="gradient-text">{site.name}</span>
          </h1>
          <p className="section-desc">{site.subtitle}</p>
          <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="pill pill-strong">{site.license} 开源</span>
            <span className="pill">Android TV / 手机 / 平板</span>
            <span className="pill">无广告 · 无注册</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="stats" style={{ marginBottom: 40 }}>
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-2">
            <div className="card">
              <div className="card-icon">
                <CodeOutlined />
              </div>
              <div className="card-title">项目定位</div>
              <div className="card-desc">
                {site.name} 是一款面向家庭影音场景的 Android 音乐播放器。它把自建 NAS
                音乐库、设备本地音乐、网络音乐与百度网盘音乐统一在一个界面里，并为电视端补上逐字卡拉OK歌词、
                K 歌伴奏、MTV 音乐视频、天气电台与可视化舞台等专属体验。
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <DownloadOutlined />
              </div>
              <div className="card-title">发布方式</div>
              <div className="card-desc">
                以单个通用 APK 发布（当前 v{APK_VERSION.replace(/^v/, "")}），内置 ARM64 / ARMv7 / x86_64
                三种架构，手机、平板、电视与模拟器共用同一份安装包，运行时自动识别设备类型并切换交互体系。官网提供最新版直链下载，历史版本见
                GitHub Releases。
              </div>
              <div style={{ marginTop: 18 }}>
                <a href={site.releases} target="_blank" rel="noreferrer" className="cta-ghost">
                  <DownloadOutlined /> 版本发布记录
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <div className="card">
              <div className="card-icon">
                <SafetyCertificateOutlined />
              </div>
              <div className="card-title">开源协议</div>
              <div className="card-desc">
                项目以 <Tag color="purple">{site.license}</Tag> 协议开源，可自由使用、修改与分发（衍生作品需同样以
                GPL v3 开源）。源码托管在 GitHub，欢迎 Issue 反馈与 Pull Request 贡献。
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <HeartOutlined />
              </div>
              <div className="card-title">致谢与声明</div>
              <div className="card-desc">
                感谢 Jellyfin、Navidrome、Subsonic、Jamendo、Open-Meteo、OpenWeatherMap 等开源与服务提供方；
                本项目与上述服务及百度网盘无隶属关系，使用时应遵守各服务方的条款与版权规定。
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <CopyrightOutlined />
              </div>
              <div className="card-title">版权说明</div>
              <div className="card-desc">
                本应用涉及的网络音乐搜索功能通过 Meting-API 端点获取公开数据，仅提供元数据索引。
                原始版权归原始版权方所有，本应用仅为聚合浏览工具，不存储、分发或转售任何媒体文件，
                也不对第三方音乐资源的合法性、准确性及可用性承担任何责任。如版权方认为其合法权益受到侵害，
                请通过 <a href={`${site.repo}/issues`} target="_blank" rel="noreferrer">GitHub Issues</a> 联系我们，我们将及时处理。
              </div>
            </div>
            <div className="card">
              <div className="card-icon">
                <ApiOutlined />
              </div>
              <div className="card-title">推荐工具</div>
              <div className="card-desc">
                <strong>bolt.new</strong> — 在浏览器中直接运行的 AI 全栈开发环境。无需本地配置，
                输入需求即可生成完整应用并一键部署。适合快速原型验证和学习新技术。
              </div>
              <div style={{ marginTop: 18 }}>
                <a
                  href="https://bolt.cello.so/baFWRasfV6k"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-primary"
                >
                  体验 bolt.new →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">API</span>
            <h2 className="section-title">已接入服务与 API 版本</h2>
            <p className="section-desc">
              应用「关于页」集中展示所有已接入后端 / 服务的 API 版本号：后端类型运行时获取真实版本，
              第三方服务展示静态版本，无版本号的服务仅列服务名。
            </p>
          </div>

          <table className="api-table">
            <thead>
              <tr>
                <th style={{ width: "38%" }}>服务 / 后端</th>
                <th>说明</th>
                <th style={{ width: "16%" }}>版本来源</th>
              </tr>
            </thead>
            <tbody>
              {apiVersions.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.desc}</td>
                  <td>{a.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center" }}>
            <div>
              <div className="card-icon">
                <ApiOutlined />
              </div>
              <h2 className="section-title">Star 趋势与社区</h2>
              <p className="section-desc">
                项目在 GitHub 持续迭代，欢迎 Star 关注更新，也欢迎提交你希望支持的音乐源与电视端体验建议。
              </p>
              <div style={{ marginTop: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a href={site.repo} target="_blank" rel="noreferrer" className="cta-primary">
                  <GithubOutlined /> Star 项目
                </a>
                <a href={site.stars} target="_blank" rel="noreferrer" className="cta-ghost">
                  查看 Star History
                </a>
              </div>
            </div>
            <div className="card">
              <div className="card-title">参与贡献</div>
              <ul className="check-list">
                <li>提交 Bug：附带设备型号、架构（ARM64 / ARMv7 / x86_64）与复现步骤</li>
                <li>提交功能建议：说明使用场景（电视 / 手机 / 车机）</li>
                <li>翻译与文档：完善使用说明与常见问题</li>
                <li>代码贡献：Fork 后按 GPL v3 协议提交 Pull Request</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h3>一起把客厅音乐体验做得更好</h3>
            <p>下载体验、反馈问题、分享给你的家庭影音群，都是对项目的支持。</p>
            <div className="cta-band-actions">
              <a href={APK_DOWNLOAD_URL} download className="cta-primary">
                <DownloadOutlined /> 直接下载最新 APK
              </a>
              <a href={`${site.repo}/issues`} target="_blank" rel="noreferrer" className="cta-ghost">
                反馈问题
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
