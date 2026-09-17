# syntax=docker/dockerfile:1.6
#
# 前端统一镜像：构建用户端 (web) + 管理后台 (admin)，用 nginx 托管
#
# 工作机制：
#   1. 用户在开发平台勾选模块（backend / admin / web）
#   2. 未选模块的目录会被平台在构建前删除（admin/ 或 web/ 可能不存在）
#   3. 本 Dockerfile 在 source-prep 阶段自动检测缺失目录，补充最小占位，
#      使后续 COPY / npm ci 不报错，对应模块的 dist 输出空目录
#   4. deploy/app.conf 由平台按用户勾选生成（不进 git），COPY 进镜像作为 nginx 默认配置
#
# 构建:
#   docker compose build
#   # 或显式控制:
#   docker build --build-arg NPM_REGISTRY=https://registry.npmmirror.com .

ARG NPM_REGISTRY=https://registry.npmmirror.com

# ============================================================
# 阶段 0：源码预处理 — 缺失模块补充占位 package.json
# ============================================================
FROM alpine:3.19 AS source-prep

WORKDIR /src
COPY . .

# 对每个可能缺失的模块，若 package.json 不存在则生成最小占位。
# 占位文件的 scripts.build = "mkdir -p dist"，使 npm run build 不报错且产出空目录。
RUN set -eux; \
    for m in web admin; do \
        if [ ! -f "$m/package.json" ]; then \
            mkdir -p "$m"; \
            printf '{"name":"empty","version":"0.0.0","private":true,"scripts":{"build":"mkdir -p dist"}}\n' \
                > "$m/package.json"; \
            printf '{}\n' > "$m/package-lock.json"; \
        fi; \
    done

# ============================================================
# 阶段 1：构建用户端 (web)
# ============================================================
FROM node:20-alpine AS web-builder

ARG NPM_REGISTRY
WORKDIR /build/web

# 利用缓存层，先单独复制依赖描述文件
COPY --from=source-prep /src/web/package.json /src/web/package-lock.json* ./

# --mount=type=cache: BuildKit 缓存挂载，宿主上所有项目的 npm 缓存共享同一份
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    if [ "$(node -e 'try{console.log(require("./package.json").name)}catch(e){console.log("missing")}')" != "empty" ]; then \
        npm ci --no-audit --no-fund --registry=$NPM_REGISTRY; \
    else \
        mkdir -p node_modules; \
    fi

# 复制源码并构建（占位模块 mkdir -p dist）
COPY --from=source-prep /src/web/ ./
RUN if [ "$(node -e 'try{console.log(require("./package.json").name)}catch(e){console.log("missing")}')" != "empty" ]; then \
        npm run build; \
    else \
        mkdir -p dist; \
    fi

# ============================================================
# 阶段 2：构建管理后台 (admin)
# ============================================================
FROM nginx:1.27-alpine

RUN rm -f /etc/nginx/conf.d/default.conf \
    && rm -rf /usr/share/nginx/html/*

# 部署目录下的 nginx 配置（由开发平台按用户勾选生成；本模板不提交 deploy/）
COPY deploy/app.conf /etc/nginx/conf.d/default.conf

# 复制 web 构建产物到 nginx 根目录（缺失模块为占位 → 空目录）
COPY --from=web-builder /build/web/dist /usr/share/nginx/html
# 复制 admin 构建产物到 nginx 根目录的 admin/ 子目录（与 vite base 匹配）

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]