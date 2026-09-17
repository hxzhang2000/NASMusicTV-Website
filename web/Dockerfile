# 前端 Dockerfile - 用户端 React 应用
# 多阶段构建：先构建，再用 Nginx 托管静态文件

# 第一阶段：构建应用
FROM node:20-alpine AS builder
WORKDIR /app

# 复制 package.json 并安装依赖（利用 Docker 缓存层）
COPY package.json package-lock.json ./
RUN npm ci --registry=https://registry.npmmirror.com

# 复制源代码并构建
COPY . .
RUN npm run build

# 第二阶段：用 Nginx 托管静态文件
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制静态文件
COPY --from=builder /app/dist .

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
