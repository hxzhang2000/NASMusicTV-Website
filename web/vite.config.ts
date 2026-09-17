import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * 网站独立版本体系：package.json 的 version 是唯一来源。
 * 构建时注入到代码中（`__APP_VERSION__` / `__APP_BUILD_TIME__`），
 * 因此改版本只需 `npm version` 或编辑 package.json，界面会自动同步。
 */
const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL("./package.json", import.meta.url)), "utf-8")
);
const buildTime = new Date().toISOString().slice(0, 16).replace("T", " ");

export default defineConfig({
  base: "/",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_TIME__: JSON.stringify(buildTime),
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
