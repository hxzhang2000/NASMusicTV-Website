# Docker 部署指南

本仓库提供完整的容器化部署方案：`mysql` + `backend` + `web(nginx)` 三个服务。
外部流量只进入 `web`（80/443），由 nginx 同时托管用户端（`web`）与管理后台（`admin`），并把 `/api` 与 `/uploads` 反向代理到 `backend`。`backend` 与 `mysql` 都不暴露端口，只在 docker 网络内可达。

> nginx 配置 `deploy/app.conf` 由平台在创建项目时按所选模块生成，属于部署/运维配置，**不放在项目代码根目录**；如需调整，改项目内 `deploy/app.conf` 后重新构建即可。

## 架构

```
                     ┌──────────────────────────────────┐
   浏览器 ──── DNS ──┤  域名（如 common.example.com）    │
                     │   ├─ /         → web 静态  │
                     │   ├─ /admin/   → admin 静态     │
                     │   ├─ /api/     → backend:8080   │
                     │   └─ /uploads/ → backend:8080   │
                     └──────────────┬───────────────────┘
                                    │ web-net
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
        ┌─────▼──────┐       ┌──────▼──────┐       ┌──────▼──────┐
        │    web     │       │  backend    │       │   mysql     │
        │  (nginx)   │──────▶│ Spring Boot │──────▶│  MySQL 8    │
        │  :80/:443  │       │   :8080     │       │   :3306     │
        └────────────┘       └─────────────┘       └─────────────┘
                              uploads 卷持久化（上传文件）
```

## 目录约定

```
.
├── docker-compose.yml        # 三个服务编排（mysql / backend / web）
├── Dockerfile            # 多阶段构建：web + admin + nginx
├── deploy/
│   └── app.conf              # web 容器的 nginx 配置（部署/运维）
├── .env.example              # compose 环境变量样例
├── backend/
│   └── Dockerfile            # Maven 构建 + JRE 21
├── web/                      # 用户端源码（仅 build 时被引用）
├── admin/                    # 管理后台源码（仅 build 时被引用）
├── certs/                    # HTTPS 证书目录（可选，自行创建）
└── db/
    └── init.d/                # MySQL 首次启动初始化 SQL（可选）
```

## 快速开始

### 1. 准备环境变量

```bash
cp .env.example .env
# 按需修改 DB_PASSWORD / APP_PORT 等
```

### 2. 一键构建并启动

```bash
docker compose build           # 构建 backend 与 web 镜像
docker compose up -d           # 启动全部服务
docker compose ps              # 查看状态
docker compose logs -f web     # 查看入口日志（首次启动看 backend 是否就绪）
```

启动顺序：

1. `mysql` 启动 → `healthcheck` 通过
2. `backend` 启动 → Flyway 跑迁移 + Tomcat 启动 → `healthcheck` 通过
3. `web` 启动 → nginx 开始监听 80

### 3. 访问

- 用户端：<http://common.example.com/>（域名解析到宿主机）
- 管理后台：<http://common.example.com/admin/>
- 接口前缀：`/api/...`
- 上传：`/uploads/...`

> 如果只在本地测试，把 `APP_PORT=80` 改成 `APP_PORT=8080`，浏览器访问 <http://localhost:8080/>。

## HTTPS（可选）

1. 把证书放到 `./certs/fullchain.pem` 和 `./certs/privkey.pem`
2. 在 `deploy/app.conf` 末尾追加 `listen 443 ssl http2;` + `ssl_certificate` / `ssl_certificate_key` 段
3. 在 `docker-compose.yml` 取消 443 端口映射的注释
4. `docker compose up -d --force-recreate web`

## 数据持久化

| 卷名                         | 用途 | 重建容器影响 |
|----------------------------|------|------------|
| `common-site_mysql-data`   | MySQL 数据目录 | 保留 |
| `common-site_uploads-data` | 上传文件 | 保留 |
| `common-site_web-logs`     | nginx access/error 日志 | 保留 |

迁移数据：

```bash
docker compose down                 # 停服
docker compose start mysql          # 只起 mysql
mysqldump ...                       # 备份
# 或反向：把备份 SQL 拷到 ./db/init.d/，配合全新卷初始化
```

## 常用命令

```bash
# 查看服务日志
docker compose logs -f backend      # 后端日志
docker compose logs -f web          # nginx 日志

# 进入容器排查
docker compose exec backend sh
docker compose exec mysql mysql -uroot -p

# 重新构建单个服务（源码变更后）
docker compose build backend
docker compose up -d backend

# 修改 deploy/app.conf 后热加载（容器内执行）
docker compose exec web nginx -t          # 校验语法
docker compose exec web nginx -s reload   # 热加载（不中断服务）

# 清理（保留数据卷）
docker compose down

# 彻底清理（删除数据卷，会丢库和上传文件）
docker compose down -v
```

## 配置变更指南

### 改后端环境变量

编辑 `.env` 后：

```bash
docker compose up -d backend
```

### 改前端

`web/` 或 `admin/` 下任何文件改动后：

```bash
docker compose build web
docker compose up -d web
```

### 改 nginx 配置（deploy/app.conf）

编辑后本地保存：

```bash
docker compose exec web nginx -t          # 校验语法
docker compose exec web nginx -s reload   # 热加载（不中断服务）
```

如改了 `Dockerfile` 或 `deploy/app.conf` 结构调整，需要重新构建镜像：

```bash
docker compose build web
docker compose up -d web
```

## 常见问题

### 1. 后端连不上 MySQL

- 等 `mysql` `healthcheck` 通过后 `backend` 才会启动，看 `docker compose ps` 确认状态
- `backend` 容器内可执行 `docker compose exec backend sh -c 'curl -v mysql:3306'` 验证
- `application.yml` 默认 host 用 `localhost`，已被 `SPRING_DATASOURCE_URL` 环境变量强制覆盖为 `mysql`

### 2. 管理后台登录后菜单空白

- 浏览器请求 `/admin/` 时 nginx 会回退到 `/admin/index.html`（SPA history 模式）
- 检查 `/api/system/menus/tree` 是否 200：浏览器直接访问 `<域名>/api/system/menus/tree`
- 后端 `DataInitializer` 会在首次启动时种入菜单；如已存在数据但菜单仍为空，检查 JWT 与角色权限

### 3. 上传文件大小限制

`deploy/app.conf` 中 `client_max_body_size 500m;`。如需调整：

```bash
# 修改 deploy/app.conf 后热加载
docker compose exec web nginx -s reload
```

### 5. 端口冲突

宿主机 80 已被占用 → 修改 `.env` 的 `APP_PORT=8080`，访问时带 `:8080`。
后端要对外暴露请**不要**改 `expose` 为 `ports`，会绕过 nginx 鉴权链路。

## 部署到生产（额外建议）

- 域名解析到宿主机后，建议在 `web` 容器前再加一层云负载均衡/L7 代理，开启 WAF 与 HTTPS 终结
- 把 `JWT_SECRET` 等敏感项从 backend `application.yml` 抽到环境变量
- 定期备份 `mysql-data` 与 `uploads-data` 卷
- 给容器打资源限制（`mem_limit: 1g` / `cpus: '1.0'`）