/// <reference types="vite/client" />

/** 构建时由 vite.config.ts 的 define 注入（来源：web/package.json 的 version） */
declare const __APP_VERSION__: string;
/** 构建时注入的构建时间，格式 YYYY-MM-DD HH:mm（构建开始时生成） */
declare const __APP_BUILD_TIME__: string;
/** 构建时注入的应用最新版更新内容（来源：应用仓库 CHANGELOG.md 最新一节，见 vite.config.ts） */
declare const __APP_CHANGELOG_LATEST__: {
  version: string;
  date: string;
  summary: string;
  sections: { label: string; items: string[] }[];
};
