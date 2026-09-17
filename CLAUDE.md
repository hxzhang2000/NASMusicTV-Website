# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

请始终使用中文回答，包括思考过程也要用中文。

网站模板：Spring Boot 后端 + React 用户端 + React 管理后台，单体仓库三工程并列。

## 项目结构

```
backend/   Spring Boot 3.3.5, Java 21, JPA + MySQL + Flyway, JWT 鉴权
web/      用户端 Vite + React 18 + antd 5 + TS, 端口 5185
admin/     后台 Vite + React 18 + antd 5 + TS, 端口 5183, 动态菜单 + 权限点
docs/superpowers/  设计文档与实施计划（specs/ 存放设计稿，plans/ 存放实施计划）
```

三个前端工程都把 `/api` 与 `/uploads` 反向代理到 `http://127.0.0.1:8080`，因此后端默认监听 8080 端口。

## 常用命令

### 后端（backend/）

```bash
mvn spring-boot:run              # 启动（需 MySQL 已起，库名 template1，账号 root/123456）
mvn -DskipTests package          # 构建 jar（跳过测试）
mvn test                         # 跑全部测试
mvn test -Dtest=SoftDeleteJpaRepositoryTests   # 跑单个测试类
```

> 后端对 UTF-8 强依赖（Windows GBK 936 控制台会让 javac 输出乱码）。`pom.xml` 已显式声明 `project.build.sourceEncoding` 与 maven-compiler-plugin 的 `<encoding>UTF-8</encoding>`，新增编译相关配置时务必保留。

### 用户端 / 管理后台

```bash
cd web && npm install && npm run dev      # http://localhost:5185
cd admin    && npm install && npm run dev      # http://localhost:5183
npm run build      # tsc --noEmit && vite build
npm run preview    # 预览构建产物
```

任一前端工程：复制 `.env.example`（admin 提供）→ `.env.local`，设置 `VITE_API_BASE_URL` 切换后端地址。

## 后端架构

### 包结构

- `com.mofan.base.common` — 横切工具：`ApiResponse`（统一响应壳 `{code, message, data, timestamp}`，`code=0` 表示成功）、`BaseEntity`（id + `createdAt`/`updatedAt` + 逻辑删除 `deleted`，`@SQLRestriction("deleted=false")`）、`BizException` + `ErrorCode`、`PageResponse`、`SoftDeleteJpaRepository`、`UrlResolver`
- `com.mofan.base.security` — JWT 链路：`SecurityConfig`（白名单 + 过滤器顺序）、`JwtAuthenticationFilter`、`JwtService`、`ApiSignatureFilter`（签名校验，默认关闭）、`CurrentUser`（从 SecurityContext 取当前用户）
- `com.mofan.base.config` — `DataInitializer`（种子数据/菜单）、`MailConfig` / `ImProperties`、OpenApi、WebConfig（CORS）
- `com.mofan.base.global.GlobalExceptionHandler` — `@RestControllerAdvice`，统一把异常翻译成 `ApiResponse.fail(code, message)`
- `com.mofan.module.*` — 业务模块，每个模块一般含 `Xxx`（Entity 继承 `BaseEntity`）、`XxxRepository`（继承 `SoftDeleteJpaRepository`）、`XxxService`、`*Controller` 与 `*AdminController`，DTO 放子包 `dto/`

业务模块：`admin / advertisement / article / category / feedback / file / goldbean / membership / page / system / user`。其中 `admin` 与 `system` 偏基础设施（管理后台聚合、菜单 / 权限 / 角色 / 设置），其余为业务模块。权限相关的 `Menu / Permission / Role / PermissionCatalog` 在 `module/system/`，由 `SystemAdminController` 暴露。

### 模块约定

- **实体**：所有业务实体继承 `BaseEntity`，自带逻辑删除；Repository 继承 `SoftDeleteJpaRepository`，`save` 不会覆盖 `deleted`，需要删除走软删。
- **Controller**：公开接口与 Admin 接口分文件（例如 `CourseController` 对外、`CourseAdminController` 对后台），共享 Service。
- **DTO**：用 record（参考 `dto/*.java`），`XxxResponse.from(entity)` 静态工厂做实体→DTO 转换。
- **分页**：Controller 用 `Pageable` + `@PageableDefault`；Service 返回 `PageResponse.from(page.map(...))`。
- **权限**：方法级 `@PreAuthorize("hasRole('ADMIN') or hasAuthority('key:action')")`，权限字符串形如 `users:list`、`advertisements:create`。
- **响应**：所有 Controller 返回 `ApiResponse<T>`，业务错误抛 `BizException(ErrorCode.X, "msg")`。

### 数据库

- MySQL，URL 形如 `jdbc:mysql://localhost:3306/template1`，账号 root/123456（可通过 `DB_USERNAME` / `DB_PASSWORD` 环境变量覆盖）
- `spring.jpa.hibernate.ddl-auto: update` + Flyway 迁移，迁移文件位于 `backend/src/main/resources/db/migration/V_YYYY_MM_DD__xxx.sql`，命名遵循 Flyway 规范
- 上传文件落盘到 `${app.upload.root-path:./uploads}/{yyyy-MM-dd}/{uuid}.{ext}`（按日期分目录），静态映射 `/uploads/**`；`MIME` 为 `video/*` 的文件仅作为通用文件类型归类，不再做转码 / 切片



## 前端架构（web/）

- 入口 `main.tsx` 用 `ConfigProvider locale={zhCN}` 包 `AntApp`，全局中文
- 路由在 `router.tsx`，每个页面用 `Layout` 包裹（首页、登录/注册、个人中心）
- 鉴权：`AuthContext` + `api.ts` 工具函数 `getToken / setToken / clearToken`（存 `localStorage`，key=`web_token`），`api.get/post/put/delete` 自动注入 `Authorization: Bearer <token>`，遇到 401 自动清 token
- `ApiError` 携带后端业务 `code`，调用方按 code 判断（如 401 跳转登录）

## 管理后台（admin/）

- 入口同样是 `main.tsx` + Ant Design 中文
- 单页 App：`App.tsx` 内置登录页（未登录态直接渲染 `<LoginPage>`），登录后加载 `UserProfile`，侧边栏菜单来自 `/api/system/menus/tree`（取不到时用 `FALLBACK_MENU_TREE`）
- 权限：本地 `hasAction(profile, menuKey, action)` 判定，ADMIN 角色全放行；权限点格式 `<menuKey>:<action>`（如 `advertisements:create`）
- 多个 PageKey 渲染分文件：`pages/CoursesPage.tsx` 等，权限相关放 `pages/system/`
- `api.ts` 已封装 `api.get/post/put/delete` + `fetchMenuTree` + `getDashboardStats` 等封装
- 工具：`utils/format.tsx`（`formatDate` 等）、`utils/permissions.ts`
- 构建：Vite 配置 `base: '/admin/'`、手动分包（`react` / `antd`），构建产物可由后端静态服务托管

## 开发约定

- 修改[vite.config.ts](web/vite.config.ts)数据库 schema 必须新增 Flyway 迁移文件，不要只依赖 `ddl-auto: update`
- 新增业务实体继承 `BaseEntity` + 配套 `SoftDeleteJpaRepository`；删除走软删（设置 `deleted = true`），不要写物理 DELETE
- 后端所有 Controller 方法返回 `ApiResponse<T>`，不要直接返回裸对象；业务异常用 `BizException(ErrorCode.X, "msg")` 而不是 `ResponseEntity.status(...)`
- 前端请求统一走 `api.ts`，业务 `code !== 0` 时会抛 `ApiError`；后端 `code=401` 时前端会自动清 token，调用方一般不需要单独处理
- 前端文案 / 错误信息保持中文，与 antd `zhCN` locale 一致
- 测试在后端：`backend/src/test/java/`，命名空间 `com.an.template.*`（注意：与生产包 `com.mofan.*` 不同，是历史遗留）

## 参考文档

- 设计与实施计划：`docs/superpowers/specs/`、`docs/superpowers/plans/`（按日期命名的 Markdown，描述本仓库的演进方向）