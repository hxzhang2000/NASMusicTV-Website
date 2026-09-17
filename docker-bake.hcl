# ⚠️ 本文件由莫一云平台自动生成，每次构建都会覆盖 —— 请勿手改。
#
# 用法（workflow 里）：
#   docker buildx bake -f docker-compose.yml -f docker-bake.hcl --push
# 说明：context / dockerfile / args / target 由 docker-compose.yml 提供，
#       本文件只补 tags（产物镜像名）与 cache-from / cache-to（构建缓存走 Harbor）。
#       缓存仓库名 = 镜像名 + "-cache"，靠 Harbor 保留策略按 *-cache 模式定期清理。

target "web" {
  tags       = ["harbor.mo1yun.com/hxzhang-31/web:v1.0.0-20260917150117-dev"]
  cache-from = ["type=registry,ref=harbor.mo1yun.com/hxzhang-31/web-cache:cache"]
  cache-to   = ["type=registry,ref=harbor.mo1yun.com/hxzhang-31/web-cache:cache,mode=max"]
}


group "default" {
  targets = ["web"]
}
