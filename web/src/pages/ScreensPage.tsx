import { DownloadOutlined, GithubOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { screens, site } from "../data/site";
import Screenshot from "../components/Screenshot";
import { screenShots } from "../data/screenshots";

export default function ScreensPage() {
  return (
    <>
      <section className="download-hero">
        <div className="container">
          <span className="section-eyebrow">Screens</span>
          <h1 className="section-title">
            界面预览
            <span className="gradient-text"> · 为客厅大屏与手机横屏而设计</span>
          </h1>
          <p className="section-desc">
            电视端保持顶部导航 + 遥控器焦点体系；手机端自动切换为底部导航 + MiniPlayer
            迷你播放条，并支持锁屏控制与车机 / 手表浏览。以下为各界面实机效果。
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="grid grid-3">
            {screens.map((s) => {
              const shot = screenShots[s.name];
              return (
                <div className="screen-card" key={s.name}>
                  {shot ? (
                    <Screenshot {...shot} alt={`${s.name} 界面截图`} />
                  ) : (
                    <div className="screen-thumb">
                      <div className="shot-placeholder">
                        <div className="shot-title">{s.name}</div>
                      </div>
                    </div>
                  )}
                  <div className="screen-body">
                    <div className="screen-name">
                      {s.name}
                      <span className="tag">{s.tag}</span>
                    </div>
                    <div className="screen-desc">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-2" style={{ marginTop: 44 }}>
            <div className="card">
              <div className="card-title">TV 专属体验</div>
              <ul className="check-list">
                <li>完整 D-Pad 焦点导航 + HDMI-CEC 遥控器媒体键</li>
                <li>可视化舞台 20+ 套特效，遥控器选定即恒定显示</li>
                <li>K 歌 / MTV 全屏页二维码，手机扫码遥控队列</li>
                <li>前台通知栏支持上一首 / 播放暂停 / 下一首</li>
              </ul>
            </div>
            <div className="card">
              <div className="card-title">手机端体验</div>
              <ul className="check-list">
                <li>底部导航：首页 / 曲库 / 搜索 / 播放队列</li>
                <li>MiniPlayer 迷你播放条，常驻非播放页底部</li>
                <li>进度条支持点击与拖拽，锁屏可直接切歌</li>
                <li>Android Auto / Wear OS 媒体浏览树</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/download" className="cta-primary">
              <DownloadOutlined /> 下载安装
            </Link>
            <Link to="/features" className="cta-ghost">
              查看完整功能清单
            </Link>
            <a href={site.repo} target="_blank" rel="noreferrer" className="cta-ghost">
              <GithubOutlined /> 在 GitHub 查看项目
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
