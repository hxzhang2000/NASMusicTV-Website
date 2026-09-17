# Common 模板

## 技术栈

- 后端: Java 21 + Spring Boot 3 + JPA + MySQL 8
- 前端: React 18 + Vite + Ant Design 5 + TypeScript
- 构建: Maven (后端) + npm (前端)

## 项目结构

```
backend/          # 后端 (pom.xml, src/main/java/...)
admin/            # 管理后台前端
web/         # 用户前端
db/migration/     # Flyway 迁移脚本
```

## 关键约定

- Entity 继承 `BaseEntity`, 加 `@SQLRestriction("deleted = false")`
- 表名 `cms_` 前缀
- Service 构造器注入, Controller 用 `ApiResponse<T>` 包裹
- 新增模块必须配 Flyway SQL (`db/migration/V{x}__xxx.sql`)
- 代码不直接输出, 统一用 `write_file` 写入

## nginx 反向代理配置（务必改对文件）

- **改代理 / 路由 / 端口只改 `deploy/app.conf`**（web 镜像 `COPY deploy/app.conf` 进容器）。
- 不要在项目根目录自建 `web.conf` 等其它 nginx 文件——镜像**不会拷贝**，改了不生效。
- 若改 `backend:` 服务名或端口，需同步修改 compose 中的服务名，保持 `proxy_pass` 指向一致，否则反代 502。
