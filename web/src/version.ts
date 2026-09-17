/**
 * 网站版本信息（构建时由 vite.config.ts 的 define 注入）。
 *
 * 版本号唯一来源是 web/package.json 的 `version` 字段；
 * 升级版本只需 `npm version <patch|minor|major>` 或手动改 package.json，
 * 重新构建后界面会自动同步，无需改任何代码。
 */
export const SITE_VERSION: string = __APP_VERSION__;

/** 构建时间，格式 YYYY-MM-DD HH:mm */
export const SITE_BUILD_TIME: string = __APP_BUILD_TIME__;
