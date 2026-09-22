import React, { useEffect, useState } from "react";
import { Button } from "antd";
import {
  PlayCircleFilled,
  GithubOutlined,
  MenuOutlined,
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { site, APK_DOWNLOAD_URL, APK_VERSION } from "../data/site";
import { SITE_VERSION } from "../version";

const NAV = [
  { path: "/", label: "首页" },
  { path: "/features", label: "功能特性" },
  { path: "/screens", label: "界面预览" },
  { path: "/download", label: "下载安装" },
  { path: "/about", label: "关于项目" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  /* 【美化要点 · 导航栏滚动状态】
     滚动超过 100px 后，导航背景由透明渐变为 rgba(10,14,20,.9) + 毛玻璃模糊。
     使用 requestAnimationFrame 节流，避免滚动时高频 setState 造成掉帧。 */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 100);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label={`${site.name} 首页`}>
            <span className="brand-logo">
              <PlayCircleFilled />
            </span>
            <span>
              {site.name}
              <span className="brand-sub">多源音乐 · TV / 手机双端</span>
            </span>
          </Link>

          <nav className={`nav-links${open ? " open" : ""}`} aria-label="主导航">
            {NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={pathname === item.path ? "active" : ""}
                aria-current={pathname === item.path ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Button
              className="mobile-menu-btn"
              type="text"
              icon={open ? <CloseOutlined /> : <MenuOutlined />}
              onClick={() => setOpen(!open)}
              aria-label="菜单"
            />
            <a href={site.repo} target="_blank" rel="noreferrer">
              <Button type="text" icon={<GithubOutlined />} style={{ color: "#98a2bf" }}>
                源码
              </Button>
            </a>
            <a href={APK_DOWNLOAD_URL} download title={`直接下载最新 APK（${APK_VERSION}）`}>
              <Button type="primary" icon={<DownloadOutlined />}>
                下载
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="site-content">{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link to="/" className="brand">
                <span className="brand-logo">
                  <PlayCircleFilled />
                </span>
                <span>{site.name}</span>
              </Link>
              <p className="footer-brand-desc">
                开源的 Android 音乐播放器（TV / 手机 / 平板通用），聚合 NAS、网络音乐与百度网盘多音乐源。
              </p>
            </div>
            <div>
              <div className="footer-title">产品</div>
              <div className="footer-links">
                <Link to="/features">功能特性</Link>
                <Link to="/screens">界面预览</Link>
                <Link to="/download">下载安装</Link>
                <Link to="/about">关于项目</Link>
              </div>
            </div>
            <div>
              <div className="footer-title">资源</div>
              <div className="footer-links">
                <a href={site.repo} target="_blank" rel="noreferrer">
                  GitHub 仓库
                </a>
                <a href={site.releases} target="_blank" rel="noreferrer">
                  版本发布记录
                </a>
                <a href={`${site.repo}#readme`} target="_blank" rel="noreferrer">
                  使用文档
                </a>
                <a href={`${site.repo}/issues`} target="_blank" rel="noreferrer">
                  问题反馈
                </a>
              </div>
            </div>
            <div>
              <div className="footer-title">支持的音乐源</div>
              <div className="footer-links">
                <span style={{ fontSize: 13, color: "#98a2bf" }}>Jellyfin / Navidrome</span>
                <span style={{ fontSize: 13, color: "#98a2bf" }}>Subsonic / 道理鱼 / 飞牛</span>
                <span style={{ fontSize: 13, color: "#98a2bf" }}>网络音乐 / 百度网盘</span>
                <span style={{ fontSize: 13, color: "#98a2bf" }}>Jamendo / 公共电台</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {site.name} · 网站 v{SITE_VERSION} · 以 {site.license} 协议开源
            </span>
            <span>与 Jellyfin、Navidrome、Subsonic、百度网盘等第三方服务无隶属关系</span>
          </div>
        </div>
      </footer>
    </>
  );
}
